import { ClientDetailsComponent } from './client-details.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ClientDetailsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ClientDetailsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
