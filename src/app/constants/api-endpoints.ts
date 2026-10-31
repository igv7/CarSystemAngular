/** Backend API paths, appended to `environment.apiBaseUrl` by UrlsService. */
export const ApiPaths = {
  ADMIN: '/admin/',
  CLIENT: '/client/',
  LOGIN: '/carSystem/login/',
  SIGNUP: '/carSystem/signUp/',
  CHECK_SESSION: '/carSystem/checkSession/',
  CAR: '/car/',
};

// Endpoint names; they must match the backend controllers' mappings.

/** Admin operations, under ApiPaths.ADMIN; the token and ids follow as path segments. */
export const AdminApi = {
  ADD_CLIENT: 'addClient',
  UPDATE_CLIENT: 'updateClient',
  VIEW_CLIENT: 'viewClient',
  VIEW_CLIENT_BY_CLIENT_ID: 'viewClientByClientID',
  VIEW_ALL_CLIENTS: 'viewAllClients',
  DELETE_CLIENT: 'deleteClient',
  ADD_CAR: 'addCar',
  UPDATE_CAR: 'updateCar',
  VIEW_CAR: 'viewCar',
  VIEW_CAR_BY_NUMBER: 'viewCarByNumber',
  VIEW_ALL_CARS: 'viewAllCars',
  DELETE_CAR: 'deleteCar',
  VIEW_ALL_CARS_BY_CAR_TYPE: 'viewAllCarsByCarType',
  VIEW_ALL_CARS_BY_CAR_COLOR: 'viewAllCarsByCarColor',
  RETURN_CAR: 'returnCar',
  VIEW_CLIENT_CAR_BY_NUMBER: 'viewClientCarByNumber',
  VIEW_ALL_CLIENT_CARS: 'viewAllClientCars',
  VIEW_ALL_CLIENT_CARS_BY_TYPE: 'viewAllClientCarsByType',
  VIEW_ALL_CLIENT_CARS_BY_COLOR: 'viewAllClientCarsByColor',
  VIEW_ALL_CLIENT_CARS_BY_PRICE: 'viewAllClientCarsByPrice',
  VIEW_RECEIPTS_BY_CLIENT: 'viewReceiptsByClient',
  VIEW_ALL_RECEIPTS: 'viewAllReceipts',
};

/** Client operations, under ApiPaths.CLIENT; the token and ids follow as path segments. */
export const ClientApi = {
  ADD_CAR: 'addCar',
  VIEW_CARS: 'viewCars',
  VIEW_MY_CARS: 'viewMyCars',
  RETURN_CAR: 'returnCar',
  VIEW_MY_RECEIPTS: 'viewMyReceipts',
  VIEW_BALANCE: 'viewBalance',
  DELETE_ACCOUNT: 'deleteAccount',
};

/** Public car catalog, under ApiPaths.CAR. */
export const CarApi = {
  VIEW_ALL_CARS: 'viewAllCars',
  VIEW_ALL_CARS_BY_CAR_TYPE: 'viewAllCarsByCarType',
};
