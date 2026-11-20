import { DetailsReceiptComponent } from './details-receipt.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('DetailsReceiptComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(DetailsReceiptComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
