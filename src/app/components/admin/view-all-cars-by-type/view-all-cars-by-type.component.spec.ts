import { ViewAllCarsByTypeComponent } from './view-all-cars-by-type.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewAllCarsByTypeComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewAllCarsByTypeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
