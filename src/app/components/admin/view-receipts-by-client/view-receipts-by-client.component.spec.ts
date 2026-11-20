import { ViewReceiptsByClientComponent } from './view-receipts-by-client.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewReceiptsByClientComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewReceiptsByClientComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
