import { ViewAllReceiptsComponent } from './view-all-receipts.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewAllReceiptsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewAllReceiptsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
