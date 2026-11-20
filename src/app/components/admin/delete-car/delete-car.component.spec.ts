import { DeleteCarComponent } from './delete-car.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('DeleteCarComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(DeleteCarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
