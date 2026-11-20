import { ViewClientCarByNumberComponent } from './view-client-car-by-number.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewClientCarByNumberComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewClientCarByNumberComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
