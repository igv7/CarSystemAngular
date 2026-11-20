import { ViewAllClientCarsComponent } from './view-all-client-cars.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewAllClientCarsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewAllClientCarsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
