const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '.eunomia/screenshots/developer/title-fix-verification.png', fullPage: true });
    console.log('Screenshot saved to .eunomia/screenshots/developer/title-fix-verification.png');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
