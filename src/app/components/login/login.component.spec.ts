import { LoginComponent } from './login.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('LoginComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(LoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
