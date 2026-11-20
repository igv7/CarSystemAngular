/** Token the mocked backend hands out; the app puts it in every admin/client URL. */
export const TOKEN = 'test-token';

export interface Car {
  id: number;
  number: string;
  color: string;
  type: string;
  amount: number;
  price: number;
  image?: string;
}

export interface Client {
  id?: number;
  firstName: string;
  lastName: string;
  nickname: string;
  clientID: string;
  birthday: string;
  password?: string;
  phoneNumber: string;
  email: string;
  balance: number;
}

/** A small fleet: two available cars (amount 1) and one rented (amount 0). */
export const CARS: Car[] = [
  { id: 1, number: '111-11-111', color: 'RED', type: 'AUDI', amount: 1, price: 120 },
  { id: 2, number: '222-22-222', color: 'BLACK', type: 'BMW', amount: 1, price: 150.5 },
  { id: 3, number: '333-33-333', color: 'WHITE', type: 'TOYOTA', amount: 0, price: 80 },
];

export const CLIENT: Client = {
  id: 7,
  firstName: 'John',
  lastName: 'Smith',
  nickname: 'john_s',
  clientID: '123456789',
  birthday: '1990-05-17',
  phoneNumber: '050-1234567',
  email: 'john@example.com',
  balance: 100,
};

export interface ClientReceipt {
  receiptId: number;
  clientId: number;
  clientNickname: string;
  clientFirstName: string;
  clientLastName: string;
  clientIdentityNumber: string;
  clientPhoneNumber: string;
  clientEmail: string;
  clientBalance: number;
  /** "yyyy-MM-dd HH:mm" */
  receiptDate: string;
  carId: number;
  carNumber: string;
  carColor: string;
  carType: string;
  carPrice: number;
}

/** A receipt for `car` rented by `client` on `date`. */
export function receipt(receiptId: number, client: Client, car: Car, date: string): ClientReceipt {
  return {
    receiptId, clientId: client.id!, clientNickname: client.nickname, clientFirstName: client.firstName,
    clientLastName: client.lastName, clientIdentityNumber: client.clientID, clientPhoneNumber: client.phoneNumber,
    clientEmail: client.email, clientBalance: client.balance, receiptDate: date,
    carId: car.id, carNumber: car.number, carColor: car.color, carType: car.type, carPrice: car.price,
  };
}

export const CLIENTS: Client[] = [
  CLIENT,
  {
    id: 8,
    firstName: 'Dana',
    lastName: 'Levi',
    nickname: 'dana.l',
    clientID: '987654321',
    birthday: '1985-11-02',
    phoneNumber: '052-7654321',
    email: 'dana@example.com',
    balance: 2500,
  },
];

/** Two receipts of john_s (CLIENT) and one of dana.l. */
export const RECEIPTS: ClientReceipt[] = [
  receipt(101, CLIENT, CARS[0], '2026-10-03 09:15'),
  receipt(102, CLIENT, CARS[2], '2026-11-12 18:40'),
  receipt(103, CLIENTS[1], CARS[1], '2026-11-15 11:05'),
];
