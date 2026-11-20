import { ViewCarComponent } from './view-car.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewCarComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewCarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
