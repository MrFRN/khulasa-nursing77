import { chromium } from 'playwright-core';
const exe = '/mnt/efs-fullstack/sessions/f7bc37bc-56ba-4700-8d3f-4dffb5c96f90/.agon-env/agent_1/home/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';
process.env.HOME='/tmp/chrhome'; process.env.XDG_CONFIG_HOME='/tmp/chrhome/.config'; process.env.XDG_CACHE_HOME='/tmp/chrhome/.cache'; process.env.TMPDIR='/tmp';
const browser = await chromium.launchPersistentContext('/tmp/cudt', { executablePath: exe, args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'] });
const page = browser.pages()[0] || await browser.newPage();
try {
  await page.goto('https://filebase-library-rzef.arcada.app/ai-assistant', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);
  const titles = await page.evaluate(() => Array.from(document.querySelectorAll('h3, h2')).map(e => e.textContent.trim()).filter(t => t.length > 0));
  console.log('AI Assistant section titles:', titles);
  // now visit a tool
  await page.goto('https://filebase-library-rzef.arcada.app/ai-assistant/calculator', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1500);
  const calcH = await page.locator('h1').first().textContent();
  console.log('Calculator page H1:', calcH);
  // find submit button
  const hasSubmit = await page.locator('button:has-text("Run")').count() > 0 || await page.locator('button:has-text("تشغيل")').count() > 0;
  console.log('Has Run button:', hasSubmit);
} catch (e) { console.log('ERR', e.message); }
finally { await browser.close(); }
