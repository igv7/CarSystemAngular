import { SubaruComponent } from './subaru.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('SubaruComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(SubaruComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
