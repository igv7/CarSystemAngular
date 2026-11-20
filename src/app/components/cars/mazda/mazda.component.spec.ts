import { MazdaComponent } from './mazda.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('MazdaComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(MazdaComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
