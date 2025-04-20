import { Component, Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ParkedVehicleService } from '../../services/parked-vehicle/parked-vehicle.service';

@Component({
  selector: 'app-vehicle-details-dialog',
  templateUrl: './vehicle-details-dialog.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatInputModule, MatCheckboxModule, ReactiveFormsModule, CurrencyMaskModule],
  providers: [DatePipe]
})
export class VehicleDetailsDialogComponent implements AfterViewInit {
  vehicleForm: FormGroup;
  canCheckoutVehicle: boolean;

  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private parkedVehicleService: ParkedVehicleService
  ) {
    this.canCheckoutVehicle = data.canCheckoutVehicle;
    this.vehicleForm = this.fb.group({
      plate: [data.plate],
      model: [data.model],
      color: [data.color],
      space: [data.space],
      entryDate: [this.formatDate(data.entryDate)],
      entryTime: [data.entryDate.split('T')[1].substring(0, 5)],
      paid: [false],
      amountToPay: [data.amountToPay],
      paymentMethod: ['']
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy')!;
  }

  formatDateWithTime(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm')!;
  }

  onCheckout(): void {
    if (this.vehicleForm.valid) {
      const token = this.authService.getToken();
      const userId = this.authService.getUserId();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const now = new Date();
      const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
      const body = {
        parkedVehicleId: this.data.id,
        checkoutDate: localDate,
        checkoutEmployeeId: userId,
        paid: this.vehicleForm.get('paid')?.value,
        amountPaid: this.vehicleForm.get('paid')?.value ? this.vehicleForm.get('amountToPay')?.value : null,
        paymentMethod: this.vehicleForm.get('paid')?.value ? this.vehicleForm.get('paymentMethod')?.value : null
      };

      this.parkedVehicleService.checkoutVehicle(body, headers).subscribe({
        next: () => {
          this.dialogRef.close({ success: true, id: this.data.id });
        },
        error: (error) => {
          console.error("Error:", error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
