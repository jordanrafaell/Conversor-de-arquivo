// /main.js
const {
  app,
  BrowserWindow
} = require('electron/main')
const path = require('node:path')
const {
  ipcMain
} = require('electron');
const converter = require('./src/scripts/libs/converter');

ipcMain.handle('pdf:convert-to-png', async (event, buffer) => {
  try {
    const caminhoImagem = await converter.pdfToPng(buffer);
    return {
      sucesso: true,
      caminho: caminhoImagem
    };
  } catch (err) {
    console.error(err);
    return {
      sucesso: false,
      erro: err.message
    };
  }
});

ipcMain.handle('pdf:convert-to-jpg', async (event, buffer) => {
  try {
    const caminhoImagem = await converter.pdfToJpg(buffer);
    return {
      sucesso: true,
      caminho: caminhoImagem
    };
  } catch (err) {
    console.error(err);
    return {
      sucesso: false,
      erro: err.message
    };
  }
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 800,
    // maxHeight: 800,
    // maxWidth: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('src/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})