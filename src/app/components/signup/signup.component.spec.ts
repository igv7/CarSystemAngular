import { SignupComponent } from './signup.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('SignupComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(SignupComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
