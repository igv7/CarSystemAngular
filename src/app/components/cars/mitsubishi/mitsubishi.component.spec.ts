import { MitsubishiComponent } from './mitsubishi.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('MitsubishiComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(MitsubishiComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
