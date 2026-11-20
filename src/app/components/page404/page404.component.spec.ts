import { Page404Component } from './page404.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('Page404Component', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(Page404Component);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
