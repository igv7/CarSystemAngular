import { ViewClientByClientIdComponent } from './view-client-by-client-id.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewClientByClientIdComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewClientByClientIdComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
