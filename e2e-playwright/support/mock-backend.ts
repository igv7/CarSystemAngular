import { Page, Request, Route } from '@playwright/test';
import { API_BASE_URL, APP_BASE_URL } from './env';

/** What a mocked endpoint answers. `abort` simulates an unreachable server (Angular sees status 0). */
export interface MockReply {
  status?: number;
  /** Sent as JSON. */
  json?: unknown;
  /** Sent as text/plain (the login token, backend error messages). */
  text?: string;
  abort?: boolean;
}

/** One request the app sent to the backend. */
export interface RecordedCall {
  method: string;
  /** URL path without the backend address, e.g. `/admin/viewAllCars/test-token`. */
  path: string;
  query: URLSearchParams;
  /** Parsed JSON body, or the raw text, or null. */
  body: any;
  /** Request headers, lower-case names. */
  headers: Record<string, string>;
}

type Handler = {
  method: string;
  path: string | RegExp;
  reply: MockReply | ((call: RecordedCall) => MockReply);
};

// The app calls the backend cross-origin with credentials and an Authorization header, so every answer
// (and the CORS preflight) needs these headers or the browser rejects it. The allowed origin is the page's
// own (the dev server, or the production build on another port).
function corsHeaders(request: Request): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': request.headers()['origin'] || new URL(APP_BASE_URL).origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  };
}

/**
 * A fake Car System backend, the frontend counterpart of mocking with Mockito: tests say what each endpoint
 * answers (`when`), and afterwards check what the app sent (`calls`). Any request no test mocked is
 * answered with 501 and listed in `unexpectedCalls`; the `backend` fixture fails the test if there are any.
 * When two handlers match, the one registered last wins, so a test can override a default.
 */
export class MockBackend {
  /** Every request the app sent to the backend, in order. CORS preflights are not included. */
  public readonly calls: RecordedCall[] = [];
  /** Requests that no handler matched, as `METHOD /path`. */
  public readonly unexpectedCalls: string[] = [];

  private readonly handlers: Handler[] = [];

  public constructor(private readonly page: Page) { }

  /** Starts intercepting every request to the backend address. */
  public async start(): Promise<void> {
    await this.page.route(`${API_BASE_URL}/**`, route => this.handle(route));
  }

  public get(path: string | RegExp, reply: Handler['reply']): this {
    return this.when('GET', path, reply);
  }

  public post(path: string | RegExp, reply: Handler['reply']): this {
    return this.when('POST', path, reply);
  }

  public put(path: string | RegExp, reply: Handler['reply']): this {
    return this.when('PUT', path, reply);
  }

  public delete(path: string | RegExp, reply: Handler['reply']): this {
    return this.when('DELETE', path, reply);
  }

  /** Answers `method path` with `reply`. A string path must match exactly; a RegExp is tested against it. */
  public when(method: string, path: string | RegExp, reply: Handler['reply']): this {
    this.handlers.push({ method, path, reply });
    return this;
  }

  /** The calls to one endpoint (`path` as in `when`). */
  public callsTo(method: string, path: string | RegExp): RecordedCall[] {
    return this.calls.filter(call => call.method === method && matches(path, call.path));
  }

  private async handle(route: Route): Promise<void> {
    const request = route.request();
    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsHeaders(request) });
      return;
    }
    const call = toCall(request);
    this.calls.push(call);

    const handler = [...this.handlers].reverse()
      .find(h => h.method === call.method && matches(h.path, call.path));
    if (!handler) {
      this.unexpectedCalls.push(`${call.method} ${call.path}`);
      await route.fulfill({ status: 501, headers: corsHeaders(request), contentType: 'text/plain', body: 'Not mocked by the test' });
      return;
    }

    const reply = typeof handler.reply === 'function' ? handler.reply(call) : handler.reply;
    if (reply.abort) {
      await route.abort('connectionrefused');
      return;
    }
    const isText = reply.text !== undefined;
    await route.fulfill({
      status: reply.status ?? 200,
      headers: corsHeaders(request),
      contentType: isText ? 'text/plain' : 'application/json',
      body: isText ? reply.text : JSON.stringify(reply.json ?? null),
    });
  }
}

function matches(pattern: string | RegExp, path: string): boolean {
  return typeof pattern === 'string' ? pattern === path : pattern.test(path);
}

function toCall(request: Request): RecordedCall {
  const url = new URL(request.url());
  const raw = request.postData();
  let body: any = null;
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = raw;
    }
  }
  return {
    method: request.method(), path: decodeURIComponent(url.pathname), query: url.searchParams, body,
    headers: request.headers(),
  };
}

// Reply helpers, so tests read like `backend.get(path, json(cars))`.

/** 200 (or `status`) with a JSON body. */
export const json = (body: unknown, status = 200): MockReply => ({ status, json: body });
/** 200 (or `status`) with a text body. */
export const text = (body: string, status = 200): MockReply => ({ status, text: body });
/** An error status with an optional text body (the backend sends its message as text). */
export const fail = (status: number, message = ''): MockReply => ({ status, text: message });
/** No answer at all: the server is unreachable. */
export const unreachable = (): MockReply => ({ abort: true });
