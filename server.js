const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/get-player-name', async (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: 'UID missing' });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new', // Use new headless mode for Chrome
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required on some cloud platforms
    });

    const page = await browser.newPage();

    // Go to the Garena shop login page
    await page.goto('https://shop.garena.sg/', { waitUntil: 'networkidle2' });

    // Replace '#uid-input' with the actual UID input field selector on the page
    await page.type('#uid-input', uid);

    // Replace '#login-button' with the actual login/submit button selector
    await Promise.all([
      page.click('#login-button'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    // Replace '.username' with the actual CSS selector for the username element after login
    const playerName = await page.$eval('.username', el => el.textContent.trim());

    await browser.close();
    res.json({ playerName });
  } catch (error) {
    if (browser) await browser.close();
    console.error('Error fetching player name:', error);
    res.status(500).json({ error: 'Failed to fetch player name' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
