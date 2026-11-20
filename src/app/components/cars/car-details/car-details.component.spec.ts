import { CarDetailsComponent } from './car-details.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('CarDetailsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(CarDetailsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
