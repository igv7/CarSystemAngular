import { ViewAllClientCarsByTypeComponent } from './view-all-client-cars-by-type.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('ViewAllClientCarsByTypeComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(ViewAllClientCarsByTypeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
