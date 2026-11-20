/** Address of the Angular dev server (`npm start` in the project root). */
export const APP_BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:4200';

/** Backend address; must match `apiBaseUrl` in src/environments/environment.ts. */
export const API_BASE_URL = process.env.E2E_API_BASE_URL ?? 'http://localhost:8080';

/** The admin account's nickname; must match `adminUserName` in src/environments/environment.ts. */
export const ADMIN_NICKNAME = process.env.E2E_ADMIN_NICKNAME ?? 'admin';

/** Real admin password, for the real-backend admin smoke test; that test is skipped when it is not set. */
export const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;
