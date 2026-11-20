// Serves the production build (dist/CarSystemAngular, made by `ng build --prod` in the project root) on
// PROD_PORT (default 4400), the way a web server would: files as they are, and index.html for any other
// path so Angular's router can handle it. Started by playwright.config.ts for the `prod-build` project.

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../dist/CarSystemAngular');
const PORT = Number(process.env.PROD_PORT) || 4400;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css',
  '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.txt': 'text/plain', '.json': 'application/json',
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(ROOT, urlPath);
  // Stay inside the build folder; anything that is not a file there gets index.html.
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(ROOT, 'index.html');
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
