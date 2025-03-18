import { TestBed } from '@angular/core/testing';

import { ParkingSettingsService } from './parking-settings.service';

describe('ParkingSettingsService', () => {
  let service: ParkingSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
