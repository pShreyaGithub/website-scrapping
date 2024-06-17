const puppeteer = require('puppeteer');

const initializeBrowser = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: puppeteer.executablePath(),
        userDataDir: '/opt/render/.cache/puppeteer',
    });
    return browser;
};

module.exports = { initializeBrowser };
