/**
 * Keys of the values kept in browser storage: the sign-in values (TOKEN, USER_*) in sessionStorage, so closing
 * the tab signs out; the menu state in localStorage.
 */
export const StorageKeys = {
  /** Sign-in token returned by the backend. */
  TOKEN: 'token',
  /** "true" while an admin is signed in. */
  USER_ADMIN: 'userAdmin',
  /** "true" while a client is signed in. */
  USER_CLIENT: 'userClient',
  /** Name the user signed in with, for the dashboards' "Hi, <name>!" greeting. */
  USER_NAME: 'userName',
  /** Collapsed sections of the admin side menu. */
  ADMIN_MENU_COLLAPSED: 'adminMenuCollapsed',
  /** Collapsed sections of the client side menu. */
  CLIENT_MENU_COLLAPSED: 'clientMenuCollapsed',
};
