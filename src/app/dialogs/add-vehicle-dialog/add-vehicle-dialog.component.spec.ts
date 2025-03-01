import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleDialogComponent } from './add-vehicle-dialog.component';

describe('AddVehicleDialogComponent', () => {
  let component: AddVehicleDialogComponent;
  let fixture: ComponentFixture<AddVehicleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddVehicleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
