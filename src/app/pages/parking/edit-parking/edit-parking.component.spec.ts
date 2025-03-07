import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParkingComponent } from './edit-parking.component';

describe('EditParkingComponent', () => {
  let component: EditParkingComponent;
  let fixture: ComponentFixture<EditParkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditParkingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
