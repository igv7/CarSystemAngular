import { HttpErrorResponse } from '@angular/common/http';

/** Texts shown in a page's message box (`<app-page-message>`) when data cannot be shown. */
export const Messages = {
  // Errors
  NO_CONNECTION: 'No connection to the server. Check your internet connection and try again.',
  SERVER_ERROR: 'The server could not complete the request. Please try again later.',
  LOAD_FAILED: 'The data could not be loaded. Please try again later.',
  wrongClientId: (id: number) => `Wrong client ID: ${id}. There is no such client!`,
  wrongCarId: (id: number) => `Wrong car ID: ${id}. There is no such car!`,
  wrongCarNumber: (num: string) => `Wrong car number: ${num}. There is no such car!`,
  wrongClientCarNumber: (id: number, num: string) =>
    `Client ID: ${id} has no car with number ${num}, or there is no such client!`,
  wrongReceiptId: (id: number) => `Wrong receipt ID: ${id}. There is no such receipt!`,

  // Empty lists
  NO_CLIENTS: 'There are no clients yet.',
  NO_CARS: 'There are no cars yet.',
  NO_RECEIPTS: 'There are no receipts yet.',
  NO_MY_CARS: 'You have no cars yet.',
  NO_MY_RECEIPTS: 'You have no receipts yet.',
  noCarsOfType: (type: string) => `There are no ${type} cars.`,
  noCarsOfColor: (color: string) => `There are no ${color} cars.`,
  clientHasNoCars: (id: number) => `Client ID: ${id} has no cars.`,
  clientHasNoCarsOfType: (id: number, type: string) => `Client ID: ${id} has no ${type} cars.`,
  clientHasNoCarsOfColor: (id: number, color: string) => `Client ID: ${id} has no ${color} cars.`,
  clientHasNoCarsUpTo: (id: number, price: number) => `Client ID: ${id} has no cars up to $${price}.`,
  clientHasNoReceipts: (id: number) => `Client ID: ${id} has no receipts.`,
};

/**
 * Message for a failed load: no connection (status 0), `notFound` when the backend rejected what was asked
 * for (400/404, e.g. an unknown id), otherwise a server error.
 */
export function loadErrorMessage(err: HttpErrorResponse, notFound: string = Messages.LOAD_FAILED): string {
  if (!err || err.status === 0) {
    return Messages.NO_CONNECTION;
  }
  return err.status === 400 || err.status === 404 ? notFound : Messages.SERVER_ERROR;
}
