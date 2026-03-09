const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.screenshot({ path: '.eunomia/screenshots/developer/calculator-animation.png', fullPage: true });
    console.log('Screenshot saved to .eunomia/screenshots/developer/calculator-animation.png');
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
})();
