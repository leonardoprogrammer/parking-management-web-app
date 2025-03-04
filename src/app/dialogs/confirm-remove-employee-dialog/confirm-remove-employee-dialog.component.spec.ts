import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRemoveEmployeeDialogComponent } from './confirm-remove-employee-dialog.component';

describe('ConfirmRemoveEmployeeDialogComponent', () => {
  let component: ConfirmRemoveEmployeeDialogComponent;
  let fixture: ComponentFixture<ConfirmRemoveEmployeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmRemoveEmployeeDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmRemoveEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
