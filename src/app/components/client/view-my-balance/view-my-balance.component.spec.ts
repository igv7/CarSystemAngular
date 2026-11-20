import { ViewMyBalanceComponent } from './view-my-balance.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewMyBalanceComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewMyBalanceComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
