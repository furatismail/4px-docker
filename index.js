const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const OUTPUT_DIR = path.join(__dirname, 'createdDocs');

// Vytvoř složku, pokud neexistuje
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 🏠 Základní root endpoint
app.get('/', (req, res) => {
  res.send('Ahoj, Docker svět!');
});

// 📝 /generate – vygeneruje soubor s časem
app.get('/generate', (req, res) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `vystup-${timestamp}.txt`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFile(filepath, `Vygenerováno v: ${timestamp}`, (err) => {
    if (err) return res.status(500).send('Chyba při zápisu souboru');
    res.send(`Soubor ${filename} byl vytvořen`);
  });
});

// 📂 /list – vypíše soubory ve složce
app.get('/list', (req, res) => {
  fs.readdir(OUTPUT_DIR, (err, files) => {
    if (err) return res.status(500).send('Chyba při čtení složky');
    res.json(files);
  });
});

// ▶️ Spuštění serveru
app.listen(3000, () => {
  console.log('Server běží na portu 3000');
});
