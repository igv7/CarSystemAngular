import { HomeComponent } from './home.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('HomeComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(HomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
