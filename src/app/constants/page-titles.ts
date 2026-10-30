/** Browser tab titles, set with `Title.setTitle()`. */
export const PageTitles = {
  HOME: 'Home Page',
  ABOUT: 'About Us',
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
  PAGE_NOT_FOUND: 'Page Not Found',
  ALL_CARS: 'All cars',
  CAR_DETAILS: 'Car Details',
  DETAILS: 'Details',

  // Admin
  ADMIN: 'Admin Page',
  ADD_CLIENT: 'Add client',
  UPDATE_CLIENT: 'Update Client',
  VIEW_CLIENT_BY_ID: 'View Client By ID',
  VIEW_CLIENT_BY_CLIENT_ID: 'View Client By Identity Number',
  ALL_CLIENTS: 'All Clients',
  CLIENT_DETAILS: 'Client Details',
  DELETE_CLIENT: 'Delete Client',
  ADD_CAR: 'Add car',
  UPDATE_CAR: 'Update Car',
  VIEW_CAR: 'View Car',
  VIEW_CAR_BY_NUMBER: 'View Car By Number',
  ALL_CARS_BY_TYPE: 'All Cars By Type',
  ALL_CARS_BY_COLOR: 'All Cars By Color',
  RETURN_CAR: 'Return Car',
  DELETE_CAR: 'Delete Car',
  VIEW_CLIENT_CAR_BY_NUMBER: 'View Client Car By Number',
  ALL_CLIENT_CARS: 'All Client Cars',
  ALL_CLIENT_CARS_BY_TYPE: 'All Client Cars By Type',
  ALL_CLIENT_CARS_BY_COLOR: 'All Client Cars By Color',
  ALL_CLIENT_CARS_BY_PRICE: 'All Client Cars By Price',
  RECEIPTS_BY_CLIENT: 'Receipts By Client',
  ALL_RECEIPTS: 'All Receipts',
  RECEIPT_DETAILS: 'Receipt Details',

  // Client
  CLIENT: 'Client Page',
  MY_CARS: 'My cars',
  MY_RECEIPTS: 'My Receipts',
  MY_BALANCE: 'My Balance',
  DELETE_ACCOUNT: 'Delete Account',
};

/** Title of a brand page, e.g. "AUDI cars". */
export function brandTitle(brand: string): string {
  return `${brand} cars`;
}
