const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from anywhere (for testing)
app.use(express.json());

app.post('/get-player-name', async (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: 'UID missing' });

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Example: Go to a Free Fire player stats page by UID
    const url = `https://example.com/player/${uid}`; // Replace with real URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Example scraping player name (adjust selector for real page)
    const playerName = await page.$eval('.player-name-selector', el => el.textContent.trim());

    await browser.close();

    res.json({ playerName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch player name' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
