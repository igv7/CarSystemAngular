export const environment = {
  production: true,
  // Lowest level that gets logged: 'debug' | 'info' | 'error'.
  logLevel: 'info',
  // No dev log server in production; point this at a backend endpoint to collect logs.
  logServerUrl: null as string,
  logToConsole: false,
  // The one account that may sign in as ADMIN; must match carsystem.admin.username in the backend.
  adminUserName: 'admin'
};
