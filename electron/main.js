const { app, BrowserWindow, shell, session, ipcMain, dialog, screen } = require('electron');
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

function getWindowStatePath() {
  return path.join(app.getPath('userData'), 'window-state.json');
}

function loadWindowState() {
  try {
    const file = getWindowStatePath();
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      const state = JSON.parse(data);
      if (state && typeof state.width === 'number' && typeof state.height === 'number') {
        return state;
      }
    }
  } catch (e) {
    console.warn('[Main] Could not read window state:', e.message);
  }
  return {
    width: 1440,
    height: 900,
    isMaximized: false,
  };
}

function saveWindowState(win) {
  if (!win || win.isDestroyed()) return;
  try {
    const isMaximized = win.isMaximized();
    const bounds = win.getNormalBounds ? win.getNormalBounds() : win.getBounds();
    const state = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized,
    };
    fs.writeFileSync(getWindowStatePath(), JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Main] Failed to save window state:', e.message);
  }
}

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
  const savedState = loadWindowState();

  const windowOpts = {
    width: savedState.width || 1440,
    height: savedState.height || 900,
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

  // Restore position if valid
  if (typeof savedState.x === 'number' && typeof savedState.y === 'number') {
    windowOpts.x = savedState.x;
    windowOpts.y = savedState.y;
  }

  // Windows 10/11 Frameless Titlebar with Native Window Controls Overlay (Snap layouts, minimize, maximize, close)
  if (process.platform === 'win32') {
    windowOpts.titleBarStyle = 'hidden';
    windowOpts.titleBarOverlay = {
      color: '#16161a',
      symbolColor: '#e0e0e0',
      height: 40,
    };
  } else if (process.platform === 'darwin') {
    windowOpts.titleBarStyle = 'hiddenInset';
  }

  if (fs.existsSync(iconPath)) {
    windowOpts.icon = iconPath;
  }

  mainWindow = new BrowserWindow(windowOpts);
  mainWindow.setMenuBarVisibility(false);

  // Restore maximized state if saved
  if (savedState.isMaximized) {
    mainWindow.maximize();
  }

  // Persistent window state saving on resize and move (debounced)
  let saveTimeout = null;
  const debouncedSaveState = () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveWindowState(mainWindow);
    }, 400);
  };

  mainWindow.on('resize', debouncedSaveState);
  mainWindow.on('move', debouncedSaveState);
  mainWindow.on('close', () => {
    saveWindowState(mainWindow);
  });

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

// IPC handler for native media files selection
ipcMain.handle('dialog:openFiles', async (event, options = {}) => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  const result = await dialog.showOpenDialog(win, {
    properties: ['openFile', 'multiSelections'],
    title: options.title || 'Import Media Files',
    filters: options.filters || [
      { name: 'Media Files', extensions: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'mp3', 'wav', 'aac', 'flac', 'ogg', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'] },
      { name: 'Video Files', extensions: ['mp4', 'mov', 'webm', 'mkv', 'avi'] },
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'aac', 'flac', 'ogg'] },
      { name: 'Image Files', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  if (result.canceled || !result.filePaths.length) {
    return [];
  }
  return result.filePaths.map(filePath => {
    try {
      const stat = fs.statSync(filePath);
      return {
        path: filePath,
        name: path.basename(filePath),
        size: stat.size,
      };
    } catch (e) {
      return {
        path: filePath,
        name: path.basename(filePath),
        size: 0,
      };
    }
  });
});

// IPC handler for native export file save
ipcMain.handle('dialog:saveExport', async (event, options = {}) => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  const result = await dialog.showSaveDialog(win, {
    title: options.title || 'Export Video',
    defaultPath: options.defaultPath || 'Untitled.mp4',
    filters: [
      { name: 'MP4 Video', extensions: ['mp4'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  if (result.canceled || !result.filePath) {
    return null;
  }
  return result.filePath;
});

// IPC handler to reveal file in Windows File Explorer
ipcMain.handle('shell:showItemInFolder', async (event, fullPath) => {
  if (fullPath && fs.existsSync(fullPath)) {
    shell.showItemInFolder(fullPath);
    return true;
  }
  return false;
});

// IPC handler to open external links
ipcMain.handle('shell:openExternal', async (event, url) => {
  if (url && (url.startsWith('http:') || url.startsWith('https:'))) {
    await shell.openExternal(url);
    return true;
  }
  return false;
});

// Window control IPC handlers
ipcMain.handle('window:minimize', () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  if (win) win.minimize();
});

ipcMain.handle('window:maximize', () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  if (win && !win.isMaximized()) win.maximize();
});

ipcMain.handle('window:unmaximize', () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  if (win && win.isMaximized()) win.unmaximize();
});

ipcMain.handle('window:toggleMaximize', () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
      return false;
    } else {
      win.maximize();
      return true;
    }
  }
  return false;
});

ipcMain.handle('window:close', () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  if (win) win.close();
});

ipcMain.handle('window:isMaximized', () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  return win ? win.isMaximized() : false;
});

app.whenReady().then(async () => {
  app.setAppUserModelId('com.vidcut.app');

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
