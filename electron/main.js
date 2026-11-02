const { app, BrowserWindow, shell, session, ipcMain, dialog } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

let server = null;
let serverPort = 0;
let mainWindow = null;

function startLocalServer(distDir) {
  return new Promise((resolve, reject) => {
    const resolvedDist = path.resolve(distDir);

    server = http.createServer((req, res) => {
      // Security headers: Enable SharedArrayBuffer & WebAssembly threads
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Access-Control-Allow-Origin', '*');

      let reqPath = decodeURIComponent(req.url.split('?')[0]);
      if (reqPath === '/' || reqPath === '') {
        reqPath = '/index.html';
      }

      let filePath = path.resolve(resolvedDist, '.' + reqPath);

      // Prevent directory traversal attacks (case-insensitive on Windows)
      if (!filePath.toLowerCase().startsWith(resolvedDist.toLowerCase())) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          res.writeHead(200, { 'Content-Type': contentType });
          fs.createReadStream(filePath).pipe(res);
        } else {
          // If the request was for a static asset (has non-html extension), return 404 instead of SPA html
          const ext = path.extname(filePath).toLowerCase();
          if (ext && ext !== '.html') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return;
          }
          // SPA Fallback: serve index.html for client-side routing
          const indexPath = path.join(resolvedDist, 'index.html');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(indexPath).pipe(res);
        }
      });
    });

    // Try predictable port 33005 first to maintain stable origin for IndexedDB/LocalStorage, fallback to ephemeral port 0 if busy
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        server.listen(0, '127.0.0.1', () => {
          const addr = server.address();
          serverPort = addr.port;
          resolve(serverPort);
        });
      } else {
        reject(err);
      }
    });

    server.listen(33005, '127.0.0.1', () => {
      const addr = server.address();
      serverPort = addr.port;
      resolve(serverPort);
    });
  });
}

function createWindow(port) {
  const iconPath = path.join(__dirname, '../build/icon.ico');
  const windowOpts = {
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#141414',
    title: 'VidCut - Video Editor',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  };

  if (fs.existsSync(iconPath)) {
    windowOpts.icon = iconPath;
  }

  mainWindow = new BrowserWindow(windowOpts);
  mainWindow.setMenuBarVisibility(false);

  // Configure session permission handlers for File System Access API
  const ses = mainWindow.webContents.session;

  ses.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true);
  });

  ses.setPermissionCheckHandler((webContents, permission) => {
    return true;
  });

  try {
    ses.on('file-system-access-restricted', (event, details, callback) => {
      if (typeof callback === 'function') callback('allow');
    });
  } catch (e) {
    /* safely ignore if unsupported event */
  }

  // Toggle DevTools with F12 or Ctrl+Shift+I
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Log renderer console warnings/errors and load failures for diagnostics
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    const levels = ['VERBOSE', 'INFO', 'WARNING', 'ERROR'];
    const levelStr = levels[level] || 'LOG';
    if (level >= 2) {
      console.error(`[Renderer ${levelStr}] ${message} (${sourceId}:${line})`);
    }
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('[Main] Renderer process gone:', details);
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`[Main] Failed to load URL ${validatedURL}: ${errorDescription} (${errorCode})`);
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC handler for native directory selection
ipcMain.handle('dialog:openDirectory', async () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select Storage Folder',
  });
  if (result.canceled || !result.filePaths.length) {
    return null;
  }
  return result.filePaths[0];
});

app.whenReady().then(async () => {
  const distDir = path.resolve(__dirname, '../dist');
  try {
    const port = await startLocalServer(distDir);
    createWindow(port);
  } catch (err) {
    console.error('Failed to start internal local server:', err);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && serverPort) {
      createWindow(serverPort);
    }
  });
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
