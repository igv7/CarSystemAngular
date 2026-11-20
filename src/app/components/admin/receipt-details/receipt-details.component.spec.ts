import { ReceiptDetailsComponent } from './receipt-details.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ReceiptDetailsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ReceiptDetailsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
