import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsDialogComponent } from './vehicle-details-dialog.component';

describe('VehicleDetailsDialogComponent', () => {
  let component: VehicleDetailsDialogComponent;
  let fixture: ComponentFixture<VehicleDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
