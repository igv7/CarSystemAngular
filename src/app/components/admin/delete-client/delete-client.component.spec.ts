import { DeleteClientComponent } from './delete-client.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('DeleteClientComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(DeleteClientComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
