const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Viewport configurations to test
const viewports = [
  { name: 'mobile-iphone-se', width: 375, height: 667, description: 'iPhone SE' },
  { name: 'mobile-iphone-xr', width: 414, height: 896, description: 'iPhone XR' },
  { name: 'tablet-ipad', width: 768, height: 1024, description: 'iPad' },
  { name: 'desktop', width: 1920, height: 1080, description: 'Desktop' },
];

const screenshotDir = path.join(process.cwd(), '.eunomia', 'screenshots', 'developer');

// Create screenshot directory if it doesn't exist
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
  console.log(`Created directory: ${screenshotDir}`);
}

async function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting dev server...');
    const serverProcess = spawn('/opt/homebrew/bin/npm', ['run', 'dev'], {
      cwd: process.cwd(),
      stdio: 'pipe',
    });

    let resolved = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);

      // Look for the local server URL in the output
      const urlMatch = output.match(/Local:\s+(https?:\/\/[^\s]+)/);
      if (urlMatch && !resolved) {
        resolved = true;
        const url = urlMatch[1].trim();
        console.log(`Dev server started at: ${url}`);
        // Give it a moment to fully start
        setTimeout(() => resolve({ url, process: serverProcess }), 2000);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server error: ${data.toString()}`);
    });

    serverProcess.on('error', (error) => {
      if (!resolved) {
        resolved = true;
        reject(error);
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        serverProcess.kill();
        reject(new Error('Dev server failed to start within 30 seconds'));
      }
    }, 30000);
  });
}

async function captureScreenshots(url) {
  console.log('\nLaunching browser...');
  const browser = await chromium.launch({ headless: true });

  try {
    for (const viewport of viewports) {
      console.log(`\nCapturing ${viewport.description} (${viewport.width}x${viewport.height})...`);

      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });

      const page = await context.newPage();

      try {
        // Navigate to the app
        await page.goto(url, { waitUntil: 'networkidle' });

        // Wait for calculator to be visible
        await page.waitForSelector('.calculator', { timeout: 5000 });

        // Take full page screenshot
        const screenshotPath = path.join(screenshotDir, `responsive-${viewport.name}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });
        console.log(`✓ Saved screenshot: ${screenshotPath}`);

        // Test some interactions and take additional screenshots

        // Test 1: Enter a calculation
        await page.click('button:has-text("5")');
        await page.click('button:has-text("+")');
        await page.click('button:has-text("3")');
        await page.click('button:has-text("=")');

        const interactionPath = path.join(screenshotDir, `responsive-${viewport.name}-interaction.png`);
        await page.screenshot({
          path: interactionPath,
          fullPage: true,
        });
        console.log(`✓ Saved interaction screenshot: ${interactionPath}`);

        // Test 2: Enter a long number to test overflow handling
        await page.click('button:has-text("C")');
        for (let i = 0; i < 12; i++) {
          await page.click('button:has-text("9")');
        }

        const overflowPath = path.join(screenshotDir, `responsive-${viewport.name}-overflow.png`);
        await page.screenshot({
          path: overflowPath,
          fullPage: true,
        });
        console.log(`✓ Saved overflow test screenshot: ${overflowPath}`);

      } catch (error) {
        console.error(`Error capturing ${viewport.description}:`, error.message);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
    console.log('\nBrowser closed.');
  }
}

async function main() {
  let serverProcess = null;

  try {
    // Start the dev server
    const server = await startDevServer();
    serverProcess = server.process;
    const url = server.url;

    // Capture screenshots
    await captureScreenshots(url);

    console.log('\n✓ All screenshots captured successfully!');
    console.log(`Screenshots saved to: ${screenshotDir}`);

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  } finally {
    // Stop the dev server
    if (serverProcess) {
      console.log('\nStopping dev server...');
      serverProcess.kill();
      // Give it time to clean up
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

main();
