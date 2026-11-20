import { ViewAllClientsComponent } from './view-all-clients.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewAllClientsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewAllClientsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
