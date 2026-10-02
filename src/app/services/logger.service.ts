import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';

/** Log levels, from least to most severe. */
export type LogLevel = 'debug' | 'info' | 'error';

const LEVEL_ORDER: { [level: string]: number } = { debug: 0, info: 1, error: 2 };
const SENSITIVE_KEY = /password|token/i;
const FLUSH_DELAY_MS = 1000;
const MAX_BATCH = 50;

/** One log line as sent to the log server. */
interface LogEntry {
  time: string;
  level: LogLevel;
  source: string;
  /** Path of the page the user was on. */
  page: string;
  message: string;
  data?: any;
}

/** Masks the login token in URL paths and password/token query parameters. */
export function redactUrl(url: string, token?: string): string {
  let redacted = url.replace(/((?:password|token)=)[^&]*/gi, '$1***');
  if (token && token !== 'null') {
    redacted = redacted.split(token).join('***');
  }
  return redacted;
}

/** Turns errors and objects into JSON-safe values, masking password and token fields. */
function toLoggable(value: any): any {
  if (value === undefined) {
    return undefined;
  }
  if (value instanceof Error || (value && value.name === 'HttpErrorResponse')) {
    return {
      name: value.name,
      message: value.message,
      status: value.status,
      url: value.url ? redactUrl(value.url, localStorage.getItem('token')) : undefined,
      stack: value instanceof Error ? value.stack : undefined
    };
  }
  try {
    return JSON.parse(JSON.stringify(value, (key, v) => (SENSITIVE_KEY.test(key) ? '***' : v)));
  } catch (e) {
    return String(value);
  }
}

/** Buffers entries and sends them to the log server in batches. */
class LogTransport {
  private buffer: LogEntry[] = [];
  private timer: any = null;
  private serverDown = false;

  constructor() {
    window.addEventListener('pagehide', () => this.flush(true));
  }

  /**
   * Queues an entry (and mirrors it to the console in development). Errors and full batches are sent at once;
   * anything else within a second.
   */
  public add(entry: LogEntry, schedule: (fn: () => void) => void = fn => fn()): void {
    if (environment.logToConsole) {
      const write = entry.level === 'error' ? console.error : entry.level === 'info' ? console.info : console.debug;
      write(`[${entry.source}] ${entry.message}`, ...(entry.data !== undefined ? [entry.data] : []));
    }
    if (!environment.logServerUrl) {
      return;
    }
    this.buffer.push(entry);
    if (this.buffer.length >= MAX_BATCH || entry.level === 'error') {
      this.flush();
    } else if (!this.timer) {
      schedule(() => this.timer = setTimeout(() => this.flush(), FLUSH_DELAY_MS));
    }
  }

  /**
   * Sends queued entries to the log server. When the page is closing, uses sendBeacon so the request survives
   * the unload.
   */
  public flush(unloading = false): void {
    clearTimeout(this.timer);
    this.timer = null;
    if (!this.buffer.length || !environment.logServerUrl) {
      return;
    }
    const body = JSON.stringify(this.buffer);
    this.buffer = [];
    if (unloading && navigator.sendBeacon) {
      navigator.sendBeacon(environment.logServerUrl, new Blob([body], { type: 'application/json' }));
      return;
    }
    // fetch instead of HttpClient so log calls skip the HTTP interceptors and can't log themselves.
    fetch(environment.logServerUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
      .then(res => this.reportServer(res.ok))
      .catch(() => this.reportServer(false));
  }

  /** Warns once in the console when the log server stops answering. */
  private reportServer(ok: boolean): void {
    if (!ok && !this.serverDown && environment.logToConsole) {
      console.warn(`Log server unreachable at ${environment.logServerUrl}; start it with "npm start" or "npm run log-server".`);
    }
    this.serverDown = !ok;
  }
}

/** Single transport shared by every logger, so all entries go out in the same batches. */
export const logTransport = new LogTransport();

/**
 * Records one entry if `level` is at or above environment.logLevel. Works without Angular DI (used by
 * main.ts).
 */
export function writeLog(level: LogLevel, source: string, message: string, data: any[], schedule?: (fn: () => void) => void): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[environment.logLevel]) {
    return;
  }
  const loggable = data.filter(d => d !== undefined).map(toLoggable);
  logTransport.add({
    time: new Date().toISOString(),
    level,
    source,
    page: window.location.pathname,
    message: String(message).trim(),
    data: loggable.length === 0 ? undefined : loggable.length === 1 ? loggable[0] : loggable
  }, schedule);
}

/** Logger for one class; every entry is tagged with its source name. */
export class Logger {
  constructor(private source: string, private zone: NgZone) { }

  /** Logs details useful while developing, such as data loaded from the server. */
  public debug(message: string, ...data: any[]): void {
    this.write('debug', message, data);
  }

  /** Logs a completed user action, such as adding a car or signing in. */
  public info(message: string, ...data: any[]): void {
    this.write('info', message, data);
  }

  /** Logs a failure; pass the error object as data so its status and URL are recorded. */
  public error(message: string, ...data: any[]): void {
    this.write('error', message, data);
  }

  private write(level: LogLevel, message: string, data: any[]): void {
    // Run the flush timer outside Angular so logging doesn't trigger change detection.
    writeLog(level, this.source, message, data, fn => this.zone.runOutsideAngular(fn));
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private zone: NgZone) { }

  /** Returns a logger whose entries are tagged with the given source, usually the class name. */
  public for(source: string): Logger {
    return new Logger(source, this.zone);
  }

}
