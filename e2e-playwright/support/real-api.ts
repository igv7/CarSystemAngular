import { APIRequestContext, request } from '@playwright/test';
import { ADMIN_NICKNAME, ADMIN_PASSWORD, API_BASE_URL } from './env';

/**
 * Direct calls to the real backend, for setting up and cleaning up test data around the real-backend UI
 * tests (fast, and independent of the UI under test). Uses the same endpoints as the Angular services.
 */
export class RealApi {
  private constructor(private readonly api: APIRequestContext, public readonly adminToken: string) { }

  /** Signs in as the admin; needs E2E_ADMIN_PASSWORD. */
  public static async asAdmin(): Promise<RealApi> {
    const api = await request.newContext({ baseURL: API_BASE_URL });
    const token = await RealApi.login(api, ADMIN_NICKNAME, ADMIN_PASSWORD!, 'ADMIN');
    return new RealApi(api, token);
  }

  /** Signs in and returns the token; throws on a refused sign-in. */
  public static async login(api: APIRequestContext, nickname: string, password: string, type: 'ADMIN' | 'CLIENT'): Promise<string> {
    const res = await api.post('/carSystem/login/', { params: { nickname, password, type } });
    if (!res.ok()) {
      throw new Error(`Sign-in as ${nickname} (${type}) failed: ${res.status()} ${await res.text()}`);
    }
    return res.text();
  }

  public async addCar(car: { number: string; color: string; type: string; price: number }): Promise<{ id: number }> {
    const res = await this.api.post(`/admin/addCar/${this.adminToken}`, { data: { ...car, amount: 1, image: 'test.jpg' } });
    if (!res.ok()) {
      throw new Error(`addCar failed: ${res.status()} ${await res.text()}`);
    }
    return res.json();
  }

  /** The car with this number, or undefined. */
  public async findCar(num: string): Promise<{ id: number; amount: number } | undefined> {
    const res = await this.api.get(`/admin/viewAllCars/${this.adminToken}`);
    return (await res.json()).find((c: any) => c.number === num);
  }

  /** The client with this nickname, or undefined. */
  public async findClient(nickname: string): Promise<{ id: number } | undefined> {
    const res = await this.api.get(`/admin/viewAllClients/${this.adminToken}`);
    return (await res.json()).find((c: any) => c.nickname === nickname);
  }

  /** Deletes the car with this number if it exists, returning it first if it is rented. */
  public async removeCar(num: string): Promise<void> {
    const car = await this.findCar(num);
    if (!car) {
      return;
    }
    if (!car.amount) {
      await this.api.delete(`/admin/returnCar/${this.adminToken}/${car.id}`);
    }
    await this.api.delete(`/admin/deleteCar/${this.adminToken}/${car.id}`);
  }

  /** Deletes the client with this nickname if it exists. */
  public async removeClient(nickname: string): Promise<void> {
    const client = await this.findClient(nickname);
    if (client) {
      await this.api.delete(`/admin/deleteClient/${this.adminToken}/${client.id}`);
    }
  }

  public async dispose(): Promise<void> {
    await this.api.dispose();
  }
}

/** A short random suffix for unique test data. */
export const uniqueSuffix = () => Date.now().toString(36).slice(-5) + Math.floor(Math.random() * 1000);

/** A random, well-formed car number (123-45-678); 9xx so it stands out from real data. */
export const randomCarNumber = () => {
  const d = (n: number) => String(Math.floor(Math.random() * 10 ** n)).padStart(n, '0');
  return `9${d(2)}-${d(2)}-${d(3)}`;
};

/** A random 9-digit identity number. */
export const randomIdentityNumber = () => String(Math.floor(100_000_000 + Math.random() * 900_000_000));
