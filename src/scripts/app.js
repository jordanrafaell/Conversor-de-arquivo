// src\scripts\app.js
const selectedFile = document.querySelector('#file');
const selectedList = document.querySelector('#formato');
const submitButton = document.querySelector('#submit_btn');
const nameFile = document.querySelector('#nameFile');


// fechar menu
document.getElementById('btn-close').addEventListener('click', () => {
  window.electronAPI.closeApp();
});


window.addEventListener('DOMContentLoaded', () => {
  console.log('window.pdfAPI:', window.pdfAPI);
  console.log('window.versions:', window.versions);
});

function setLoading(ativo) {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    loadingEl.style.display = ativo ? 'none' : 'block';
  }
}

// Function de mensagem
function exibirMensagem(msg, tipo = 'sucesso') {
  const status = document.querySelector('#status');
  status.textContent = msg;

  if (tipo === 'erro') {
    status.style.color = 'red';
  } else {
    status.style.color = 'green';
  }

  setTimeout(() => {
    status.textContent = '';
  }, 3000);
  // evento de tempo para apagar a mensagem de aviso
}

// Evento Seleciona o arquivo e exibe o nome do arquivo
selectedFile.addEventListener('change', () => {
  const file = selectedFile.files[0];
  if (file) {
    nameFile.textContent = ` ${file.name}`;
  } else {
    nameFile.textContent = 'Nome do arquivo não encontrado';
  }
});

// validação de arquivo
function validarArquivo(file, formato) {
  if (!file) return 'Selecione um arquivo';

  const fileType = file.type;
  const extension = file.name.split('.').pop().toLowerCase();

  if (!formato) return 'Selecione um formato de arquivo válido';

  if (
    (formato === 'pdf_to_png' || formato === 'pdf_to_jpg') &&
    (fileType !== 'application/pdf' || extension !== 'pdf')
  ) {
    return 'Selecione um arquivo PDF válido';
  }

  return null; // Se tudo estiver OK
}

// Evento para selecionar o formato do arquivo
submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (selectedFile.files.length === 0) {
    alert('Selecione um arquivo');
    return;
  }

  const file = selectedFile.files[0]; // pegando o arquivo selecionado
  const fileType = file.type; // pegando o tipo do arquivo

  const formato = selectedList.value; // pegando o valor da lista do select

  const arquivoSelecionado = file.name; // pegando o nome do arquivo selecionado

  const fileExtension = arquivoSelecionado.split('.').pop().toLowerCase(); // pegando a extensão do arquivo

  if (!selectedList.value) {
    alert('Selecione um formato de arquivo valido');
    return;
  }

  if (fileType === null) {
    alert('Selecione um arquivo valido');
    return;
  }

  const erro = validarArquivo(file, formato);
  if (erro) return alert(erro);
  // Tipos de formatos

  // 📄 PDF → Imagem
  if (
    (formato === 'pdf_to_png' || formato === 'pdf_to_jpg') &&
    (fileType !== 'application/pdf' || fileExtension !== 'pdf')
  ) {
    alert('Selecione um arquivo PDF Válido');
    return;
  }

  // if (formato === 'pdf_to_txt' && fileType !== 'application/pdf' && fileExtension !== 'pdf') {
  //   alert('Selecione um arquivo PDF válido para converter em TXT');
  //   return;
  // }

  // if (formato === 'txt_to_pdf' && fileType !== 'text/plain' && fileExtension !== 'txt') {
  //   alert('Selecione um arquivo TXT válido para converter em PDF');
  //   return;
  // }

  switch (formato) {
    case 'pdf_to_png':
      convertPdfToPng(file);
      break;
    case 'pdf_to_jpg':
      convertPdfToJpg(file);
      break;
    default:
      alert('Conversão não implementada ou tipo de arquivo inválido');
  }
});

// Função para converter PDF para Image
async function convertPdfToPng(file) {
  setLoading(true);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  window.pdfAPI
    .convertPdfToPng(buffer)
    .then(() => {
      exibirMensagem('Conversão concluída!');
    })
    .catch((err) => {
      console.error('Erro na conversão:', err);
      exibirMensagem('Erro ao converter', 'erro');
    })
    .finally(() => {
      setLoading(false);
    });
}

async function convertPdfToJpg(file) {
  setLoading(true);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  window.pdfAPI
    .convertPdfToJpg(buffer)
    .then(() => {
      exibirMensagem('Conversão concluída!');
    })
    .catch((err) => {
      console.error('Erro na conversão:', err);
      exibirMensagem('Erro ao converter', 'erro');
    })
    .finally(() => {
      setLoading(false);
    });
}

// Resposta do main.js

window.electronAPI.onRespostaSalvar((event, respota) => {
  if (respota.sucesso) {
    exibirMensagem('Arquivo salvo com sucesso!');
  } else {
    exibirMensagem('Erro ao salvar o arquivo', 'erro');
  }
  setLoading(false);
});

ipcMain.on('salvar-arquivo', async (event, { conteudo, caminho, nome }) => {
  try {
    await salvarArquivo(conteudo, caminho, nome);
    event.sender.send('resposta-salvar', {
      sucesso: true,
    });
  } catch (e) {
    event.sender.send('resposta-salvar', {
      sucesso: false,
    });
  }
});
