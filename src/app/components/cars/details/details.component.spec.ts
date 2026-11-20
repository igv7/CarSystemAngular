import { DetailsComponent } from './details.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('DetailsComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(DetailsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
