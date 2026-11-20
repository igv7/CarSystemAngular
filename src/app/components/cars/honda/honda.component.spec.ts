import { HondaComponent } from './honda.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('HondaComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(HondaComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
