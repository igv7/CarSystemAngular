// Development log server: receives log entries from the Angular app and appends them to logs/app.log.
//
//   node log-server.js           -> log server only
//   node log-server.js --serve   -> log server + `ng serve` (used by `npm start`)
//
// The dev server proxies POST /__log to this server (see proxy.conf.json).

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = Number(process.env.LOG_PORT) || 4300;
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_BODY_BYTES = 1024 * 1024;

fs.mkdirSync(LOG_DIR, { recursive: true });

function rotateIfNeeded() {
  try {
    if (fs.statSync(LOG_FILE).size >= MAX_FILE_BYTES) {
      fs.renameSync(LOG_FILE, LOG_FILE + '.1');
    }
  } catch (e) {
    // File does not exist yet.
  }
}

function formatEntry(entry) {
  const level = String(entry.level || 'INFO').toUpperCase().padEnd(5);
  const source = entry.source ? ` [${entry.source}]` : '';
  const page = entry.page ? ` (${entry.page})` : '';
  const data = entry.data !== undefined ? ' ' + JSON.stringify(entry.data) : '';
  return `${entry.time || new Date().toISOString()} ${level}${source}${page} ${entry.message || ''}${data}`;
}

function writeEntries(entries) {
  rotateIfNeeded();
  fs.appendFileSync(LOG_FILE, entries.map(formatEntry).join('\n') + '\n');
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/__log') {
    res.writeHead(404).end();
    return;
  }

  let body = '';
  let tooLarge = false;
  req.setEncoding('utf8');
  req.on('data', chunk => {
    body += chunk;
    if (body.length > MAX_BODY_BYTES) {
      tooLarge = true;
      req.destroy();
    }
  });
  req.on('end', () => {
    if (tooLarge) {
      return;
    }
    try {
      const parsed = JSON.parse(body);
      writeEntries(Array.isArray(parsed) ? parsed : [parsed]);
      res.writeHead(204).end();
    } catch (e) {
      res.writeHead(400).end();
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Log server listening on http://localhost:${PORT}, writing to ${LOG_FILE}`);
});

if (process.argv.includes('--serve')) {
  const ngBin = require.resolve('@angular/cli/bin/ng');
  const ng = spawn(process.execPath, [ngBin, 'serve', '--proxy-config', 'proxy.conf.json'], { stdio: 'inherit' });
  ng.on('exit', code => {
    server.close();
    process.exit(code || 0);
  });
  ['SIGINT', 'SIGTERM'].forEach(signal => process.on(signal, () => ng.kill(signal)));
}
