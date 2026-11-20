import { ViewClientComponent } from './view-client.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewClientComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewClientComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
