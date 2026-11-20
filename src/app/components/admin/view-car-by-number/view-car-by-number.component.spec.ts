import { ViewCarByNumberComponent } from './view-car-by-number.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewCarByNumberComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewCarByNumberComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
