import { TestBed } from '@angular/core/testing';

import { ExitAdminGuardService } from './exit-admin-guard.service';

describe('ExitAdminGuardService', () => {
  let service: ExitAdminGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExitAdminGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
