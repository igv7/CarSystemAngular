import { CarSearchComponent } from './car-search.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('CarSearchComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(CarSearchComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
