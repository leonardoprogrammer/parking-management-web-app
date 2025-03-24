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
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';

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
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    provideNgxMask()
  ],
  templateUrl: './add-vehicle-dialog.component.html',
  styleUrls: ['./add-vehicle-dialog.component.scss'],
})
export class AddVehicleDialogComponent {
  vehicleForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddVehicleDialogComponent>,
    private fb: FormBuilder
  ) {
    const now = moment();
    this.vehicleForm = this.fb.group({
      plate: ['', [Validators.required]],
      model: ['', [Validators.required]],
      color: ['', [Validators.required]],
      space: [''],
      entryDate: [now.format('DD/MM/YYYY'), [Validators.required]],
      entryTime: [now.format('HH:mm'), [Validators.required]]
    });
  }

  onInputUpperCase(field: string): void {
    const control = this.vehicleForm.get(field);
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }

  onAdd(): void {
    if (this.vehicleForm.valid) {
      const entryDate = moment(this.vehicleForm.get('entryDate')!.value, 'DD/MM/YYYY').format('YYYY-MM-DD');
      let entryTime = this.vehicleForm.get('entryTime')!.value;
      if (entryTime.length === 4) {
        entryTime = `${entryTime.slice(0, 2)}:${entryTime.slice(2)}`;
      }
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
