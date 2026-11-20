import { ViewAllClientCarsByPriceUntilComponent } from './view-all-client-cars-by-price-until.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewAllClientCarsByPriceUntilComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewAllClientCarsByPriceUntilComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
