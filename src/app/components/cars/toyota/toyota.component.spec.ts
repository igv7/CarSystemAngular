import { ToyotaComponent } from './toyota.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ToyotaComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ToyotaComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
