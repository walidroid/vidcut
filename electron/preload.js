const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  openFiles: (options) => ipcRenderer.invoke('dialog:openFiles', options),
  saveExport: (options) => ipcRenderer.invoke('dialog:saveExport', options),
  showItemInFolder: (path) => ipcRenderer.invoke('shell:showItemInFolder', path),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  unmaximize: () => ipcRenderer.invoke('window:unmaximize'),
  toggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
});


