import { APP_BASE_URL } from './env';

/** Fails fast with a clear message when the Angular dev server is not running, instead of 100 timeouts. */
export default async function globalSetup(): Promise<void> {
  try {
    const res = await fetch(APP_BASE_URL, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    throw new Error(
      `The Angular app is not reachable at ${APP_BASE_URL} (${(err as Error).message}).\n` +
      `Start it first: run "npm start" in the CarSystemAngular folder (on Node 14), then run the tests again.`);
  }
}
