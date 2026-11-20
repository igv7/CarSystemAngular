import { AudiComponent } from './audi.component';
import { setUpComponent } from 'src/app/testing/component-test';

describe('AudiComponent', () => {
  it('should create', async () => {
    const fixture = await setUpComponent(AudiComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
