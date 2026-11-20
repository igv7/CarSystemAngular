import { ItemsService } from './items.service';

describe('ItemsService', () => {
  it('starts with empty holders (nothing in the app uses it at the moment)', () => {
    const items = new ItemsService();
    expect(items.car).toEqual({});
    expect(items.cars).toEqual([]);
    expect(items.clientReceipts).toEqual([]);
  });
});
