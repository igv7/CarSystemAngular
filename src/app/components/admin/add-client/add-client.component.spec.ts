import { AddClientComponent } from './add-client.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('AddClientComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(AddClientComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
