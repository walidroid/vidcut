/**
 * scripts/audit-electron-environment.js
 * Instruments packaged Electron main and renderer processes to capture exact process.versions
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const appDir = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\VidCut\\resources\\app';
const asarPath = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\VidCut\\resources\\app.asar';
const exePath = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\VidCut\\VidCut.exe';

const mainJsPath = path.join(appDir, 'electron', 'main.js');
const preloadJsPath = path.join(appDir, 'electron', 'preload.js');

const originalMainJs = fs.readFileSync(mainJsPath, 'utf8');
const originalPreloadJs = fs.readFileSync(preloadJsPath, 'utf8');

const mainOutPath = path.resolve(__dirname, '../electron_main_versions.json');
const rendererOutPath = path.resolve(__dirname, '../electron_renderer_versions.json');

try {
  // 1. Instrument preload.js to capture renderer process.versions
  const instrumentedPreload = `
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  versions: process.versions,
});

try {
  fs.writeFileSync(${JSON.stringify(rendererOutPath)}, JSON.stringify(process.versions, null, 2));
} catch (e) {}
`;
  fs.writeFileSync(preloadJsPath, instrumentedPreload, 'utf8');

  // 2. Instrument main.js
  const instrumentedMain = `
const fs = require('fs');
try {
  fs.writeFileSync(${JSON.stringify(mainOutPath)}, JSON.stringify(process.versions, null, 2));
} catch(e) {}
` + originalMainJs + `
// Auto quit after 2 seconds for headless audit
setTimeout(() => {
  try { app.quit(); } catch(e) {}
}, 2500);
`;
  fs.writeFileSync(mainJsPath, instrumentedMain, 'utf8');

  // 3. Repack asar
  console.log('[Audit] Repacking asar with instrumentation...');
  execSync(`npx @electron/asar pack "${appDir}" "${asarPath}"`);

  // 4. Launch VidCut.exe
  console.log('[Audit] Launching VidCut.exe to capture process.versions...');
  const child = spawn(exePath, [], { detached: true, stdio: 'ignore' });
  child.unref();

  // Wait 3.5 seconds
  execSync('node -e "setTimeout(() => {}, 3500)"');

  // 5. Read captured outputs
  if (fs.existsSync(mainOutPath)) {
    console.log('\n=== ELECTRON MAIN PROCESS VERSIONS ===');
    console.log(fs.readFileSync(mainOutPath, 'utf8'));
  } else {
    console.log('Main versions file not found!');
  }

  if (fs.existsSync(rendererOutPath)) {
    console.log('\n=== ELECTRON RENDERER PROCESS VERSIONS ===');
    console.log(fs.readFileSync(rendererOutPath, 'utf8'));
  } else {
    console.log('Renderer versions file not found!');
  }

} finally {
  // Restore original files and repack
  console.log('[Audit] Restoring clean main.js and preload.js...');
  fs.writeFileSync(mainJsPath, originalMainJs, 'utf8');
  fs.writeFileSync(preloadJsPath, originalPreloadJs, 'utf8');
  execSync(`npx @electron/asar pack "${appDir}" "${asarPath}"`);
  console.log('[Audit] Clean asar restored.');
}
