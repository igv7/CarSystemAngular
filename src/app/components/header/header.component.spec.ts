import { HeaderComponent } from './header.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('HeaderComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(HeaderComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
