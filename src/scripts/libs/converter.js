// src/scripts/libs/converter.js
const os = require('os');
const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const { createCanvas } = require('canvas');

// Função para converter PDF em PNG (1 página só)
async function pdfToPng(buffer) {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 2 }); // escala para melhorar qualidade
  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  // Definindo pasta de saída na home do usuário (Downloads/Conversoes)
  const outputDir = path.join(os.homedir(), 'Downloads', 'Conversoes');

  // Cria a pasta se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = File.name
  const outputPath = path.join(outputDir, 'pagina1.png');

  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createPNGStream();

  return new Promise((resolve, reject) => {
    stream.pipe(out);
    out.on('finish', () => resolve(outputPath));
    out.on('error', reject);
  });
}

// Função para converter PDF em JPG (1 página só)
async function pdfToJpg(buffer) {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 2 });
  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  const outputDir = path.join(os.homedir(), 'Downloads', 'Conversoes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'pagina1.jpg');

  // ⚠️ Substituindo JPEGStream por toBuffer
  const bufferOut = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(outputPath, bufferOut);

  return outputPath;
}


module.exports = {
  pdfToPng,
  pdfToJpg,
};
