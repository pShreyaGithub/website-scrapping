const puppeteer = require("puppeteer");

let browser;

async function initializeBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
}
initializeBrowser();

async function getHtml(url) {
  if (!browser) {
    await initializeBrowser();
  }
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait for a specific element to ensure the page is fully rendered
  // Adjust the selector to match a key element on the page
  await page.waitForSelector("div, p, h1, h2, h3, h4, h5, h6", { timeout: 5000 });
  const screenShot = await page.screenshot({ encoding: "base64" });
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  return { html, screenShot };
}

module.exports = { getHtml };
