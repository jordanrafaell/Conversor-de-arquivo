// /preload.js
const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
});

contextBridge.exposeInMainWorld('electronAPI', {
  // Essas funções continuam enviando para o main, que pode salvar arquivo etc
  onRespostaSalvar: (callback) => ipcRenderer.on('resposta-salvar', callback),
  salvarArquivo: (data) => ipcRenderer.invoke('salvar-arquivo', data)
});

contextBridge.exposeInMainWorld('pdfAPI', {
  convertPdfToPng: (buffer) => ipcRenderer.invoke('pdf:convert-to-png', buffer),
  convertPdfToJpg: (buffer) => ipcRenderer.invoke('pdf:convert-to-jpg', buffer),
});
