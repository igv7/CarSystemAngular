import { ViewMyCarsComponent } from './view-my-cars.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewMyCarsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewMyCarsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
