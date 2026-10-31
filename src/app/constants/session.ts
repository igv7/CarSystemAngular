/**
 * How often, while someone is signed in, the app asks the backend whether the session is still active.
 * The backend removes idle sessions after 30 minutes and checks once a minute, so a sign-out shows up at most
 * about two minutes after the session ends there.
 */
export const SESSION_CHECK_INTERVAL_MS = 60 * 1000;
