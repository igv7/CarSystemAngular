import { AboutComponent } from './about.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('AboutComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(AboutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
