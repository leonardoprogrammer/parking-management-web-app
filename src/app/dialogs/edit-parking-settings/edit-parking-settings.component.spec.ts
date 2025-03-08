import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParkingSettingsComponent } from './edit-parking-settings.component';

describe('EditParkingSettingsComponent', () => {
  let component: EditParkingSettingsComponent;
  let fixture: ComponentFixture<EditParkingSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditParkingSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditParkingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
