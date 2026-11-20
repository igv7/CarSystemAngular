import { BmwComponent } from './bmw.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('BmwComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(BmwComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
