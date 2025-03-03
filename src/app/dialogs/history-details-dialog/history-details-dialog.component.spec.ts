import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDetailsDialogComponent } from './history-details-dialog.component';

describe('HistoryDetailsDialogComponent', () => {
  let component: HistoryDetailsDialogComponent;
  let fixture: ComponentFixture<HistoryDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
