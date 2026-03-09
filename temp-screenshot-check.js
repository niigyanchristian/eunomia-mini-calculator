const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5175/');
  
  // Wait for the title animation to complete (1.5s typewriter + small buffer)
  await page.waitForTimeout(2000);
  
  await page.screenshot({ 
    path: '.eunomia/screenshots/developer/title-fix-verification.png',
    fullPage: true 
  });
  
  await browser.close();
  console.log('Screenshot saved to .eunomia/screenshots/developer/title-fix-verification.png');
})();
