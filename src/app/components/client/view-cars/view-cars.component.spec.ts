import { ViewCarsComponent } from './view-cars.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewCarsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewCarsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
