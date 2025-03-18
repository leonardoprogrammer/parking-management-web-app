import { TestBed } from '@angular/core/testing';

import { EmployeePermissionsService } from './employee-permissions.service';

describe('EmployeePermissionsService', () => {
  let service: EmployeePermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeePermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
