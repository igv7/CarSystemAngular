import { ClientComponent } from './client.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ClientComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ClientComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
