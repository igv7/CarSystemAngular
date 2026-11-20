import { MercedesComponent } from './mercedes.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('MercedesComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(MercedesComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
