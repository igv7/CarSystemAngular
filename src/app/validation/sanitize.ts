import { HttpErrorResponse } from '@angular/common/http';

/** Fields never trimmed, because leading or trailing spaces can be part of a password. */
const UNTRIMMED_FIELDS = ['password'];

/**
 * Returns a shallow copy of `obj` with surrounding whitespace removed from every string field except
 * passwords, so " audi " or "name " are not stored with stray spaces.
 */
export function trimFields<T>(obj: T): T {
  const copy: any = { ...obj };
  Object.keys(copy).forEach(key => {
    if (typeof copy[key] === 'string' && UNTRIMMED_FIELDS.indexOf(key) === -1) {
      copy[key] = copy[key].trim();
    }
  });
  return copy;
}

/** Encodes a value for use as one URL path segment or query value, so `/`, `&`, `#` or `?` can't change the URL. */
export function urlPart(value: string | number): string {
  return encodeURIComponent(String(value));
}

/**
 * The message to show for a failed request: the backend's per-field validation errors or its message text,
 * or null when the response carries none (e.g. the server could not be reached).
 */
export function serverErrorMessage(err: HttpErrorResponse): string | null {
  const body = err && err.error;
  if (!body) {
    return null;
  }
  if (typeof body === 'string') {
    return body;
  }
  if (body.errors && typeof body.errors === 'object') {
    return Object.keys(body.errors).map(field => `${field}: ${body.errors[field]}`).join('\n');
  }
  return typeof body.message === 'string' ? body.message : null;
}
