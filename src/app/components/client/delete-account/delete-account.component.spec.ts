import { DeleteAccountComponent } from './delete-account.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('DeleteAccountComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(DeleteAccountComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
