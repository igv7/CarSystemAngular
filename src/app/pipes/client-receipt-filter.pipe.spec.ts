import { ClientReceiptFilterPipe } from './client-receipt-filter.pipe';
import { ClientReceipt } from '../models/clientReceipt';

describe('ClientReceiptFilterPipe', () => {
  const pipe = new ClientReceiptFilterPipe();
  const receipt = (id: number, nickname: string, first?: string, last?: string, identity?: string) => {
    const r = new ClientReceipt();
    Object.assign(r, { receiptId: id, clientNickname: nickname, clientFirstName: first, clientLastName: last, clientIdentityNumber: identity });
    return r;
  };
  const john = receipt(101, 'john_s', 'John', 'Smith', '123456789');
  const dana = receipt(102, 'dana.l', 'Dana', 'Levi', '987654321');
  const old = receipt(103, 'oldtimer');
  const receipts = [john, dana, old];

  it('returns every receipt for an empty filter', () => {
    expect(pipe.transform(receipts, '')).toBe(receipts);
    expect(pipe.transform(receipts, null)).toBe(receipts);
  });

  it('matches nickname, names, full name and identity number', () => {
    expect(pipe.transform(receipts, 'JOHN_S')).toEqual([john]);
    expect(pipe.transform(receipts, 'dana levi')).toEqual([dana]);
    expect(pipe.transform(receipts, '1234')).toEqual([john]);
  });

  it('copes with receipts from before names existed', () => {
    expect(pipe.transform(receipts, 'oldtimer')).toEqual([old]);
    expect(pipe.transform(receipts, 'nobody')).toEqual([]);
  });
});
