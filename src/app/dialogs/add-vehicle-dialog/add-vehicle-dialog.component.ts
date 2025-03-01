import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-vehicle-dialog',
  template: `
    <h2 mat-dialog-title>Adicionar Veículo</h2>
    <mat-dialog-content>
      <form [formGroup]="vehicleForm">
        <mat-form-field>
          <mat-label>Placa</mat-label>
          <input matInput formControlName="plate" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Modelo</mat-label>
          <input matInput formControlName="model" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Cor</mat-label>
          <input matInput formControlName="color" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Vaga</mat-label>
          <input matInput formControlName="space">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Data de Entrada</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="entryDate" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Hora de Entrada</mat-label>
          <input matInput formControlName="entryTime" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Fechar</button>
      <button mat-button color="primary" (click)="onAdd()" [disabled]="vehicleForm.invalid">Adicionar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class AddVehicleDialogComponent {
  vehicleForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddVehicleDialogComponent>,
    private fb: FormBuilder
  ) {
    this.vehicleForm = this.fb.group({
      plate: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      space: [''],
      entryDate: [moment(), Validators.required],
      entryTime: [moment().format('HH:mm'), [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]]
    });
  }

  onAdd(): void {
    if (this.vehicleForm.valid) {
      const entryDate = this.vehicleForm.get('entryDate')!.value.format('YYYY-MM-DD');
      const entryTime = this.vehicleForm.get('entryTime')!.value;
      const entryDateTime = `${entryDate}T${entryTime}:00`;

      const vehicleData = {
        ...this.vehicleForm.value,
        entryDate: entryDateTime
      };

      delete vehicleData.entryTime;

      this.dialogRef.close(vehicleData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
