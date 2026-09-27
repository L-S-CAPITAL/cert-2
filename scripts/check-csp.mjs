// Verifies that the production build ships the Content-Security-Policy
// <meta> tag injected by vite.config.mts. Vite may HTML-escape the quotes
// in the attribute (e.g. &#39;self&#39;), so decode before checking.
import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'dist/index.html';
const html = readFileSync(file, 'utf8');
const tag = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]*)"\s*\/?>/i);

function fail(message) {
  console.error(`::error file=${file}::${message}`);
  process.exit(1);
}

if (!tag) fail('Content-Security-Policy meta tag missing');

const policy = tag[1]
  .replace(/&#39;|&#x27;|&apos;/gi, "'")
  .replace(/&quot;|&#34;/gi, '"')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&amp;/gi, '&');

const directives = new Map(
  policy
    .split(';')
    .map((part) => part.trim().split(/\s+/))
    .filter((parts) => parts[0])
    .map(([name, ...values]) => [name, values]),
);

const required = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'none'"],
};
for (const [name, values] of Object.entries(required)) {
  const actual = directives.get(name) ?? [];
  for (const value of values) {
    if (!actual.includes(value)) fail(`CSP ${name} must include ${value} (got: ${actual.join(' ') || 'nothing'})`);
  }
}
const scriptSrc = directives.get('script-src') ?? [];
for (const unsafe of ["'unsafe-inline'", "'unsafe-eval'"]) {
  if (scriptSrc.includes(unsafe)) fail(`CSP script-src must not include ${unsafe}`);
}

console.log(`CSP OK: ${policy}`);
