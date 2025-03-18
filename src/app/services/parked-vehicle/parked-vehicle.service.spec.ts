import { TestBed } from '@angular/core/testing';

import { ParkedVehicleService } from './parked-vehicle.service';

describe('ParkedVehicleService', () => {
  let service: ParkedVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkedVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
