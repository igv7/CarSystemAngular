import { ViewMyReceiptsComponent } from './view-my-receipts.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewMyReceiptsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewMyReceiptsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
