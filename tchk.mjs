import { chromium } from 'playwright-core';
const exe = '/mnt/efs-fullstack/sessions/f7bc37bc-56ba-4700-8d3f-4d3f-4dffb5c96f90/.agon-env/agent_1/home/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';
process.env.HOME='/tmp/chrhome'; process.env.XDG_CONFIG_HOME='/tmp/chrhome/.config'; process.env.XDG_CACHE_HOME='/tmp/chrhome/.cache'; process.env.TMPDIR='/tmp';
const browser = await chromium.launchPersistentContext('/tmp/cudaichk', { executablePath: exe, args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'] });
const page = browser.pages()[0] || await browser.newPage();
try {
  await page.goto('https://filebase-library-rzef.arcada.app/ai-assistant', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2000);
  const body = await page.locator('body').innerText();
  console.log('H1:', (body.match(/AI Assistant[\s\S]{0,80}/g) || []).slice(0,1)[0] || 'none');
  console.log('has "Quick links"?', body.includes('Quick links'));
  console.log('has "New clinical analysis"?', body.includes('New clinical analysis'));
  console.log('has "Trusted guidelines" card?', body.includes('Trusted guidelines'));
  console.log('has "What\'s inside"?', body.includes("What's inside"));
} catch (e) { console.log('ERR', e.message); }
finally { await browser.close(); }
