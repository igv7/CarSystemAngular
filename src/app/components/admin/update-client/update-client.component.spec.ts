import { UpdateClientComponent } from './update-client.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('UpdateClientComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(UpdateClientComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
