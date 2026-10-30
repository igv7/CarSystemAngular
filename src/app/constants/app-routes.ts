/** URL segments of every route; app-routing.module.ts builds the route config from these. */
export const RoutePaths = {
  HOME: 'home',
  CARS: 'cars',
  LOGIN: 'login',
  SIGNUP: 'signup',
  ABOUT: 'about',
  ADMIN: 'admin',
  CLIENT: 'client',

  // Brand pages, one per CarType value (lower case)
  AUDI: 'audi',
  BMW: 'bmw',
  HONDA: 'honda',
  MAZDA: 'mazda',
  MERCEDES: 'mercedes',
  MITSUBISHI: 'mitsubishi',
  SUBARU: 'subaru',
  TOYOTA: 'toyota',
  VOLKSWAGEN: 'volkswagen',

  // Admin operations (children of /admin)
  ADD_CLIENT: 'add-client',
  UPDATE_CLIENT: 'update-client',
  VIEW_CLIENT: 'view-client',
  VIEW_CLIENT_BY_CLIENT_ID: 'view-client-by-client-id',
  VIEW_ALL_CLIENTS: 'view-all-clients',
  DELETE_CLIENT: 'delete-client',
  ADD_CAR: 'add-car',
  UPDATE_CAR: 'update-car',
  VIEW_CAR: 'view-car',
  VIEW_CAR_BY_NUMBER: 'view-car-by-number',
  VIEW_ALL_CARS: 'view-all-cars',
  VIEW_ALL_CARS_BY_TYPE: 'view-all-cars-by-type',
  VIEW_ALL_CARS_BY_COLOR: 'view-all-cars-by-color',
  RETURN_CAR: 'return-car',
  DELETE_CAR: 'delete-car',
  VIEW_CLIENT_CAR_BY_NUMBER: 'view-client-car-by-number',
  VIEW_ALL_CLIENT_CARS: 'view-all-client-cars',
  VIEW_ALL_CLIENT_CARS_BY_TYPE: 'view-all-client-cars-by-type',
  VIEW_ALL_CLIENT_CARS_BY_COLOR: 'view-all-client-cars-by-color',
  VIEW_ALL_CLIENT_CARS_BY_PRICE_UNTIL: 'view-all-client-cars-by-price-until',
  VIEW_RECEIPTS_BY_CLIENT: 'view-receipts-by-client',
  VIEW_ALL_RECEIPTS: 'view-all-receipts',

  // Client pages (children of /client)
  VIEW_CARS: 'view-cars',
  VIEW_MY_CARS: 'view-my-cars',
  VIEW_MY_RECEIPTS: 'view-my-receipts',
  VIEW_MY_BALANCE: 'view-my-balance',
  DELETE_ACCOUNT: 'delete-account',

  // Detail pages (children of a list or lookup page); the id follows as the next segment
  CAR_ID: 'car-id',
  CLIENT_ID: 'client-id',
  CAR_DETAILS: 'car-details',
  CLIENT_DETAILS: 'client-details',
  RECEIPT_DETAILS: 'receipt-details',
  DETAILS: 'details',
  DETAILS_RECEIPT: 'details-receipt',
};

/** Route parameter that holds the id on detail pages (`car-id/:id`). */
export const ID_PARAM = 'id';

/** Builds a `/<parent>/<child>` link. */
const link = (...segments: string[]) => '/' + segments.join('/');

/** Absolute links for `router.navigate()`, `routerLink` and the side menus. */
export const AppRoutes = {
  HOME: link(RoutePaths.HOME),
  CARS: link(RoutePaths.CARS),
  LOGIN: link(RoutePaths.LOGIN),
  SIGNUP: link(RoutePaths.SIGNUP),
  ABOUT: link(RoutePaths.ABOUT),
  ADMIN: link(RoutePaths.ADMIN),
  CLIENT: link(RoutePaths.CLIENT),

  AUDI: link(RoutePaths.AUDI),
  BMW: link(RoutePaths.BMW),
  HONDA: link(RoutePaths.HONDA),
  MAZDA: link(RoutePaths.MAZDA),
  MERCEDES: link(RoutePaths.MERCEDES),
  MITSUBISHI: link(RoutePaths.MITSUBISHI),
  SUBARU: link(RoutePaths.SUBARU),
  TOYOTA: link(RoutePaths.TOYOTA),
  VOLKSWAGEN: link(RoutePaths.VOLKSWAGEN),

  ADMIN_ADD_CLIENT: link(RoutePaths.ADMIN, RoutePaths.ADD_CLIENT),
  ADMIN_UPDATE_CLIENT: link(RoutePaths.ADMIN, RoutePaths.UPDATE_CLIENT),
  ADMIN_VIEW_CLIENT: link(RoutePaths.ADMIN, RoutePaths.VIEW_CLIENT),
  ADMIN_VIEW_CLIENT_BY_CLIENT_ID: link(RoutePaths.ADMIN, RoutePaths.VIEW_CLIENT_BY_CLIENT_ID),
  ADMIN_VIEW_ALL_CLIENTS: link(RoutePaths.ADMIN, RoutePaths.VIEW_ALL_CLIENTS),
  ADMIN_DELETE_CLIENT: link(RoutePaths.ADMIN, RoutePaths.DELETE_CLIENT),
  ADMIN_ADD_CAR: link(RoutePaths.ADMIN, RoutePaths.ADD_CAR),
  ADMIN_UPDATE_CAR: link(RoutePaths.ADMIN, RoutePaths.UPDATE_CAR),
  ADMIN_VIEW_CAR: link(RoutePaths.ADMIN, RoutePaths.VIEW_CAR),
  ADMIN_VIEW_CAR_BY_NUMBER: link(RoutePaths.ADMIN, RoutePaths.VIEW_CAR_BY_NUMBER),
  ADMIN_VIEW_ALL_CARS: link(RoutePaths.ADMIN, RoutePaths.VIEW_ALL_CARS),
  ADMIN_VIEW_ALL_CARS_BY_TYPE: link(RoutePaths.ADMIN, RoutePaths.VIEW_ALL_CARS_BY_TYPE),
  ADMIN_VIEW_ALL_CARS_BY_COLOR: link(RoutePaths.ADMIN, RoutePaths.VIEW_ALL_CARS_BY_COLOR),
  ADMIN_RETURN_CAR: link(RoutePaths.ADMIN, RoutePaths.RETURN_CAR),
  ADMIN_DELETE_CAR: link(RoutePaths.ADMIN, RoutePaths.DELETE_CAR),
  ADMIN_VIEW_CLIENT_CAR_BY_NUMBER: link(RoutePaths.ADMIN, RoutePaths.VIEW_CLIENT_CAR_BY_NUMBER),
  ADMIN_VIEW_ALL_CLIENT_CARS: link(RoutePaths.ADMIN, RoutePaths.VIEW_ALL_CLIENT_CARS),
  ADMIN_VIEW_ALL_CLIENT_CARS_BY_TYPE: link(RoutePaths.ADMIN, RoutePaths.VIEW_ALL_CLIENT_CARS_BY_TYPE),
  ADMIN_VIEW_ALL_CLIENT_CARS_BY_COLOR: link(RoutePaths.ADMIN, RoutePaths.VIEW_ALL_CLIENT_CARS_BY_COLOR),
  ADMIN_VIEW_ALL_CLIENT_CARS_BY_PRICE_UNTIL: link(RoutePaths.ADMIN, RoutePaths.VIEW_ALL_CLIENT_CARS_BY_PRICE_UNTIL),
  ADMIN_VIEW_RECEIPTS_BY_CLIENT: link(RoutePaths.ADMIN, RoutePaths.VIEW_RECEIPTS_BY_CLIENT),
  ADMIN_VIEW_ALL_RECEIPTS: link(RoutePaths.ADMIN, RoutePaths.VIEW_ALL_RECEIPTS),

  CLIENT_VIEW_CARS: link(RoutePaths.CLIENT, RoutePaths.VIEW_CARS),
  CLIENT_VIEW_MY_CARS: link(RoutePaths.CLIENT, RoutePaths.VIEW_MY_CARS),
  CLIENT_VIEW_MY_RECEIPTS: link(RoutePaths.CLIENT, RoutePaths.VIEW_MY_RECEIPTS),
  CLIENT_VIEW_MY_BALANCE: link(RoutePaths.CLIENT, RoutePaths.VIEW_MY_BALANCE),
  CLIENT_DELETE_ACCOUNT: link(RoutePaths.CLIENT, RoutePaths.DELETE_ACCOUNT),
};

/** Link of a brand page: the brand in lower case without spaces (e.g. "Mercedes" → `/mercedes`). */
export function brandLink(brand: string): string {
  return link(brand.toLowerCase().replace(/\s/g, ''));
}

/** Query parameter on `/login` saying which area sent the user there (`/login?as=client`). */
export const LOGIN_AS_PARAM = 'as';

/** Values of LOGIN_AS_PARAM. */
export const LoginAs = {
  ADMIN: 'admin',
  CLIENT: 'client',
};
