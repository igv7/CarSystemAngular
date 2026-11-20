import { ViewAllCarsByColorComponent } from './view-all-cars-by-color.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewAllCarsByColorComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewAllCarsByColorComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
