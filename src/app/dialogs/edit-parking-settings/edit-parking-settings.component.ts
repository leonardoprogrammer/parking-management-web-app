import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ParkingSettingsService } from '../../services/parking-settings/parking-settings.service';

@Component({
  selector: 'app-edit-parking-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, CurrencyMaskModule],
  providers: [provideNgxMask()],
  templateUrl: './edit-parking-settings.component.html',
  styleUrls: ['./edit-parking-settings.component.scss']
})
export class EditParkingSettingsComponent implements OnInit {
  settingsForm: FormGroup;
  isCreateMode: boolean = false;
  isSaveEnabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditParkingSettingsComponent>,
    private parkingSettingsService: ParkingSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: { parkingId: string }
  ) {
    this.settingsForm = this.fb.group({
      chargeFromCheckIn: [false, Validators.required],
      minimumTimeToCharge: ['', Validators.required],
      period: ['', Validators.required],
      valuePerPeriod: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSettings();
    this.settingsForm.valueChanges.subscribe(() => {
      this.onFieldChange();
    });
    this.settingsForm.get('chargeFromCheckIn')?.valueChanges.subscribe(value => {
      if (value) {
        this.settingsForm.get('minimumTimeToCharge')?.disable();
      } else {
        this.settingsForm.get('minimumTimeToCharge')?.enable();
      }
    });
  }

  loadSettings() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.parkingSettingsService.getSettings(this.data.parkingId, headers).subscribe({
      next: (data) => {
        this.settingsForm.patchValue({
          chargeFromCheckIn: data.chargeFromCheckIn,
          minimumTimeToCharge: data.minimumTimeToCharge,
          period: data.period,
          valuePerPeriod: data.valuePerPeriod
        });
        this.isCreateMode = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.isCreateMode = true;
          this.snackBar.open('Não há configuração ainda. Deseja criar?', 'Fechar', {
            duration: 3000,
          });
        } else {
          this.snackBar.open('Erro ao tentar recuperar configurações', 'Fechar', {
            duration: 3000,
          });
        }
      },
    });
  }

  createSettings() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = this.prepareRequestBody();

    this.parkingSettingsService.createSettings(this.data.parkingId, body, headers).subscribe({
      next: (data) => {
        this.settingsForm.patchValue({
          chargeFromCheckIn: data.chargeFromCheckIn,
          minimumTimeToCharge: data.minimumTimeToCharge,
          period: data.period,
          valuePerPeriod: data.valuePerPeriod
        });
        this.isCreateMode = false;
        this.snackBar.open('Configurações criadas com sucesso!', 'Fechar', {
          duration: 3000,
        });
      },
      error: (error) => {
        this.snackBar.open('Erro ao tentar criar configurações', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  saveSettings() {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = this.prepareRequestBody();

    this.parkingSettingsService.saveSettings(this.data.parkingId, body, headers).subscribe({
      next: () => {
        this.snackBar.open('Configurações salvas com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open('Erro ao tentar salvar configurações', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  prepareRequestBody() {
    const formValue = this.settingsForm.value;
    return {
      chargeFromCheckIn: formValue.chargeFromCheckIn,
      minimumTimeToCharge: this.formatTime(formValue.minimumTimeToCharge),
      period: this.formatTime(formValue.period),
      valuePerPeriod: formValue.valuePerPeriod
    };
  }

  formatTime(time: string): string {
    if (time.length === 8) {
      return time;
    }
    return time.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
  }

  onFieldChange() {
    this.isSaveEnabled = this.settingsForm.dirty && this.settingsForm.valid;
  }

  cancel() {
    this.dialogRef.close();
  }
}
