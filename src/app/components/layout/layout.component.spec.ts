import { LayoutComponent } from './layout.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('LayoutComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(LayoutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
