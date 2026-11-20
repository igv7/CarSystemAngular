import { ReturnCarComponent } from './return-car.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ReturnCarComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ReturnCarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
