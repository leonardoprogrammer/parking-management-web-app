import { Component, Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-vehicle-details-dialog',
  template: `
    <h2 mat-dialog-title>Detalhes do Veículo</h2>
    <mat-dialog-content>
      <form [formGroup]="vehicleForm">
        <mat-form-field>
          <mat-label>Placa</mat-label>
          <input matInput formControlName="plate" readonly>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Modelo</mat-label>
          <input matInput formControlName="model" readonly>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Cor</mat-label>
          <input matInput formControlName="color" readonly>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Vaga</mat-label>
          <input matInput formControlName="space" readonly>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Data de Entrada</mat-label>
          <input matInput formControlName="entryDate" readonly>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Hora de Entrada</mat-label>
          <input matInput formControlName="entryTime" readonly>
        </mat-form-field>
        <mat-checkbox *ngIf="canCheckoutVehicle" formControlName="paid">Pago</mat-checkbox>
        <mat-form-field *ngIf="canCheckoutVehicle && vehicleForm.get('paid')?.value">
          <mat-label>Método de Pagamento</mat-label>
          <input matInput formControlName="paymentMethod" required>
        </mat-form-field>
      </form>
      <div class="additional-info">
        <p><strong>Adicionado pelo funcionário:</strong> {{ data.checkinEmployeeName }}</p>
        <p><strong>Adicionado em:</strong> {{ formatDateWithTime(data.checkinDate) }}</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Fechar</button>
      <button *ngIf="canCheckoutVehicle" mat-button color="primary" (click)="onCheckout()" [disabled]="vehicleForm.invalid">Checkout</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatInputModule, MatCheckboxModule, ReactiveFormsModule],
  providers: [DatePipe]
})
export class VehicleDetailsDialogComponent implements AfterViewInit {
  vehicleForm: FormGroup;
  canCheckoutVehicle: boolean;

  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
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
        paymentMethod: this.vehicleForm.get('paid')?.value ? this.vehicleForm.get('paymentMethod')?.value : null
      };

      this.http.post<any>('http://localhost:8083/parked-vehicle/checkout', body, { headers }).subscribe({
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
