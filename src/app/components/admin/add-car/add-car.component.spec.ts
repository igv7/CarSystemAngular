import { AddCarComponent } from './add-car.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('AddCarComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(AddCarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
