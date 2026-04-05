const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: '/usr/bin/chromium',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1366, height: 768 });
  
  // Go to Fiverr and act more human-like
  await page.goto('https://www.fiverr.com/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Random mouse movements
  await page.mouse.move(100, 100);
  await page.waitForTimeout(500);
  await page.mouse.move(300, 300);
  await page.waitForTimeout(500);
  await page.mouse.move(500, 200);
  
  console.log('Fiverr Title:', await page.title());
  console.log('URL:', page.url());
  
  // Check if captcha
  const content = await page.content();
  if (content.includes('human') || content.includes('captcha') || content.includes('challenge')) {
    console.log('BLOCKED by CAPTCHA');
  } else {
    console.log('Page loaded!');
  }
  
  await page.waitForTimeout(5000);
  await browser.close();
})();