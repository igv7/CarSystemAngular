import { ClientReceiptDateFilterPipe } from './client-receipt-date-filter.pipe';
import { ClientReceipt } from '../models/clientReceipt';

describe('ClientReceiptDateFilterPipe', () => {
  const pipe = new ClientReceiptDateFilterPipe();
  const dated = (id: number, receiptDate: string) => Object.assign(new ClientReceipt(), { receiptId: id, receiptDate });
  const october = dated(1, '2026-10-03 09:15');
  const november = dated(2, '2026-11-12 18:40');
  const receipts = [october, november];

  it('returns every receipt for an empty filter', () => {
    expect(pipe.transform(receipts, '')).toBe(receipts);
    expect(pipe.transform(receipts, undefined)).toBe(receipts);
  });

  it('keeps receipts whose date contains the text', () => {
    expect(pipe.transform(receipts, '2026-11')).toEqual([november]);
    expect(pipe.transform(receipts, '09:15')).toEqual([october]);
    expect(pipe.transform(receipts, '2026')).toEqual(receipts);
    expect(pipe.transform(receipts, '2025')).toEqual([]);
  });
});
