import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateParkingComponent } from './create-parking.component';

describe('CreateParkingComponent', () => {
  let component: CreateParkingComponent;
  let fixture: ComponentFixture<CreateParkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateParkingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
