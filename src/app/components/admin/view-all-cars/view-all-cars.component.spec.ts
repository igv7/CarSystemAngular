import { ViewAllCarsComponent } from './view-all-cars.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewAllCarsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewAllCarsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
