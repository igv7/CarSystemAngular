import { test, expect } from '@playwright/test';
import { ChildProcess, spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

/**
 * log-server.js, tested on its own: a copy runs from a temporary folder (it writes to logs/ next to
 * itself), on a free port, so the real logs/app.log is never touched. No browser needed.
 */
const SOURCE = path.resolve(__dirname, '../../../log-server.js');

let dir: string;
let logFile: string;
let baseUrl: string;
let server: ChildProcess;

/** A port nobody is listening on. */
function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = net.createServer().listen(0, '127.0.0.1', () => {
      const { port } = probe.address() as net.AddressInfo;
      probe.close(() => resolve(port));
    }).on('error', reject);
  });
}

const post = (body: string) =>
  fetch(`${baseUrl}/__log`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });

const lines = () => fs.readFileSync(logFile, 'utf8').trim().split('\n');

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'log-server-'));
  fs.copyFileSync(SOURCE, path.join(dir, 'log-server.js'));
  logFile = path.join(dir, 'logs', 'app.log');
  const port = await freePort();
  baseUrl = `http://127.0.0.1:${port}`;

  server = spawn(process.execPath, ['log-server.js'], { cwd: dir, env: { ...process.env, LOG_PORT: String(port) } });
  await new Promise<void>((resolve, reject) => {
    server.stdout!.on('data', chunk => String(chunk).includes('listening') && resolve());
    server.on('exit', code => reject(new Error(`log-server.js exited with ${code}`)));
    setTimeout(() => reject(new Error('log-server.js did not start')), 10_000);
  });
});

test.afterAll(async () => {
  // Wait for the process to end: on Windows its working folder can't be deleted while it runs.
  if (server && server.exitCode === null) {
    const exited = new Promise(resolve => server.once('exit', resolve));
    server.kill();
    await exited;
  }
  fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
});

test.beforeEach(() => {
  fs.rmSync(path.join(dir, 'logs', 'app.log'), { force: true });
  fs.rmSync(path.join(dir, 'logs', 'app.log.1'), { force: true });
});

test('writes a batch as one formatted line per entry', async () => {
  const res = await post(JSON.stringify([
    { time: '2026-11-20 10:15:30.123', level: 'info', source: 'LoginComponent', page: '/login', message: 'Client john_s logged in' },
    { time: '2026-11-20 10:15:31.000', level: 'error', source: 'HTTP', page: '/client', message: 'GET /x -> 500', data: { status: 500 } },
  ]));

  expect(res.status).toBe(204);
  expect(lines()).toEqual([
    '2026-11-20 10:15:30.123 INFO  [LoginComponent] (/login) Client john_s logged in',
    '2026-11-20 10:15:31.000 ERROR [HTTP] (/client) GET /x -> 500 {"status":500}',
  ]);
});

test('accepts a single entry and fills in a missing time', async () => {
  const res = await post(JSON.stringify({ level: 'debug', message: 'no time given' }));

  expect(res.status).toBe(204);
  expect(lines()).toHaveLength(1);
  expect(lines()[0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} DEBUG no time given$/);
});

test('appends to the file across requests', async () => {
  await post(JSON.stringify({ time: 't1', level: 'info', message: 'first' }));
  await post(JSON.stringify({ time: 't2', level: 'info', message: 'second' }));

  expect(lines()).toEqual(['t1 INFO  first', 't2 INFO  second']);
});

test('answers 400 to a body that is not JSON, and writes nothing', async () => {
  const res = await post('{not json');

  expect(res.status).toBe(400);
  expect(fs.existsSync(logFile)).toBe(false);
});

test('answers 404 to anything but POST /__log', async () => {
  expect((await fetch(`${baseUrl}/__log`)).status).toBe(404);
  expect((await fetch(`${baseUrl}/other`, { method: 'POST', body: '[]' })).status).toBe(404);
});

test('drops a body over 1 MB without writing it', async () => {
  const huge = JSON.stringify([{ level: 'info', message: 'x'.repeat(1024 * 1024 + 10) }]);

  await expect(post(huge)).rejects.toThrow();

  expect(fs.existsSync(logFile)).toBe(false);
  // The server is still up.
  expect((await post(JSON.stringify({ time: 't', message: 'still alive' }))).status).toBe(204);
});

test('moves a full app.log (5 MB) to app.log.1 and starts a new one', async () => {
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  const old = 'old line\n'.repeat(Math.ceil((5 * 1024 * 1024) / 9));
  fs.writeFileSync(logFile, old);

  await post(JSON.stringify({ time: 't', level: 'info', message: 'after rotation' }));

  expect(fs.readFileSync(logFile + '.1', 'utf8')).toBe(old);
  expect(lines()).toEqual(['t INFO  after rotation']);
});
