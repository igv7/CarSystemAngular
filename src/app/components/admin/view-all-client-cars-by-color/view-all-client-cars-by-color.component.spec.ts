import { ViewAllClientCarsByColorComponent } from './view-all-client-cars-by-color.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewAllClientCarsByColorComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewAllClientCarsByColorComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
