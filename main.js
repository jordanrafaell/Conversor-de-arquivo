// /main.js
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const path = require('path');
const converter = require('./src/scripts/libs/converter');

console.log('🚀 Electron foi iniciado com sucesso');

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

ipcMain.on('app:close', () => {
  app.quit();
});

const createWindow = () => {
  console.log('🪟 Criando janela...');


  // organização de barra 
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    maxHeight: 600,
    maxWidth: 400,
    frame: false, // REMOVE a barra padrão (titulo + botoes)
    icon: path.join(__dirname, 'src/assets/icon.ico'), // Usa sua logo
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // win.removeMenu(); // Remove o menu custom

  win.loadFile(path.resolve(app.getAppPath(), 'src/index.html'));

  win.webContents.on('did-finish-load', () => {
    console.log('✅ HTML carregado com sucesso!');

    // Desativa atalho para abrir DevTools
    win.webContents.on('before-input-event', (event, input) => {
      if (
        (input.control && input.shift && input.key.toLowerCase() === 'i') || // Ctrl+Shift+I
        input.key === 'F12' // F12
      ) {
        event.preventDefault();
      }
    });

    // Bloqueia clique direito (menu de contexto)
    win.webContents.executeJavaScript(`
      window.addEventListener('contextmenu', event => event.preventDefault());
    `);
  });
};




app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});