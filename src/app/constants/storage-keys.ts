/** Keys of the values kept in localStorage. */
export const StorageKeys = {
  /** Sign-in token returned by the backend. */
  TOKEN: 'token',
  /** "true" while an admin is signed in. */
  USER_ADMIN: 'userAdmin',
  /** "true" while a client is signed in. */
  USER_CLIENT: 'userClient',
  /** Read by LoginService, but nothing stores it at the moment. */
  USER_NAME: 'userName',
  /** Collapsed sections of the admin side menu. */
  ADMIN_MENU_COLLAPSED: 'adminMenuCollapsed',
  /** Collapsed sections of the client side menu. */
  CLIENT_MENU_COLLAPSED: 'clientMenuCollapsed',
};
