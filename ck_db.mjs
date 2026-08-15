import { readFileSync } from 'node:fs';
import https from 'node:https';
const env = readFileSync('.env', 'utf8');
const get = (k) => { const m = env.match(new RegExp('^' + k + '=(.*)$', 'm')); return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined; };
const SUPA = get('NEXT_PUBLIC_SUPABASE_URL').replace(/\/$/, '');
const KEY = get('SUPABASE_SERVICE_ROLE_KEY');
for (const t of ['interview_questions', 'interview_categories', 'resources', 'categories']) {
  const path = `/rest/v1/${t}?select=id&limit=2`;
  const url = SUPA + path;
  await new Promise((resolve) => {
    const r = https.request({ method: 'GET', hostname: new URL(url).hostname, path: new URL(url).pathname + new URL(url).search, headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } }, (res) => {
      let c = ''; res.on('data', (d) => c += d); res.on('end', () => { console.log(t, '->', res.statusCode, c.slice(0, 200)); resolve(); });
    });
    r.on('error', () => resolve()); r.end();
  });
}
