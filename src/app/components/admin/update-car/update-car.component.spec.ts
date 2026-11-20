import { UpdateCarComponent } from './update-car.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('UpdateCarComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(UpdateCarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
