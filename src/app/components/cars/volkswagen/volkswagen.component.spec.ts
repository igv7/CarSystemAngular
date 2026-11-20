import { VolkswagenComponent } from './volkswagen.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('VolkswagenComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(VolkswagenComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
