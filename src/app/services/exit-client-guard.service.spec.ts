import { TestBed } from '@angular/core/testing';

import { ExitClientGuardService } from './exit-client-guard.service';

describe('ExitClientGuardService', () => {
  let service: ExitClientGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExitClientGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
