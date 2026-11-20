import { CarsComponent } from './cars.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('CarsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(CarsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
