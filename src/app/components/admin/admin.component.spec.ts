import { AdminComponent } from './admin.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('AdminComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(AdminComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
