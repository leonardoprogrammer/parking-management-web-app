import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-details-dialog',
  template: `
    <h2 mat-dialog-title>Detalhes do Veículo</h2>
    <mat-dialog-content>
      <form [formGroup]="vehicleForm">
        <mat-form-field>
          <mat-label>Placa</mat-label>
          <input matInput formControlName="plate">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Modelo</mat-label>
          <input matInput formControlName="model">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Cor</mat-label>
          <input matInput formControlName="color">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Vaga</mat-label>
          <input matInput formControlName="space">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Data de Entrada</mat-label>
          <input matInput formControlName="entryDate">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Hora de Entrada</mat-label>
          <input matInput formControlName="entryTime">
        </mat-form-field>
        <mat-checkbox formControlName="paid">Pago</mat-checkbox>
        <mat-form-field *ngIf="vehicleForm.get('paid')?.value">
          <mat-label>Método de Pagamento</mat-label>
          <input matInput formControlName="paymentMethod" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Fechar</button>
      <button mat-button color="primary" (click)="onCheckout()" [disabled]="vehicleForm.invalid">Checkout</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatInputModule, MatCheckboxModule, ReactiveFormsModule]
})
export class VehicleDetailsDialogComponent {
  vehicleForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.vehicleForm = this.fb.group({
      plate: [data.plate, Validators.required],
      model: [data.model, Validators.required],
      color: [data.color, Validators.required],
      space: [data.space],
      entryDate: [data.entryDate.split('T')[0], Validators.required],
      entryTime: [data.entryDate.split('T')[1].substring(0, 5), Validators.required],
      paid: [false],
      paymentMethod: ['']
    });
  }

  onCheckout(): void {
    if (this.vehicleForm.valid) {
      const token = this.authService.getToken();
      const userId = this.authService.getUserId();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const body = {
        parkedVehicleId: this.data.id,
        checkoutDate: new Date().toISOString(),
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
