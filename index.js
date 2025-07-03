const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const OUTPUT_DIR = path.join(__dirname, 'createdDocs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

app.get('/', (req, res) => {
  res.send('Ahoj, Docker svět!');
});

app.get('/generate', (req, res) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `vystup-${timestamp}.txt`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFile(filepath, `Vygenerováno v: ${timestamp}`, (err) => {
    if (err) return res.status(500).send('Chyba při zápisu souboru');
    res.send(`Soubor ${filename} byl vytvořen`);
  });
});

app.get('/list', (req, res) => {
  fs.readdir(OUTPUT_DIR, (err, files) => {
    if (err) return res.status(500).send('Chyba při čtení složky');
    res.json(files);
  });
});

// 🔁 Zavolá endpoint druhého kontejneru
app.get('/call-app2', async (req, res) => {
  try {
    const response = await axios.get('http://app2:3000/');
    res.send(`Odpověď od app2: ${response.data}`);
  } catch (error) {
    res.status(500).send('Nepodařilo se spojit s app2');
  }
});

app.listen(3000, () => {
  console.log('Server běží na portu 3000');
});
