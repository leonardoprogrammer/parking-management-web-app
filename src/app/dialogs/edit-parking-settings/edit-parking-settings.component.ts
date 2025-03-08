import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-parking-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-parking-settings.component.html',
  styleUrls: ['./edit-parking-settings.component.scss']
})
export class EditParkingSettingsComponent implements OnInit {
  settingsForm: FormGroup;
  isCreateMode: boolean = false;
  isSaveEnabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditParkingSettingsComponent>,
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
  }

  loadSettings() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8082/parking-settings?parkingId=${this.data.parkingId}`;

    this.http.get<any>(url, { headers }).subscribe({
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
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8082/parking-settings?parkingId=${this.data.parkingId}`;
    const body = this.settingsForm.value;

    this.http.post<any>(url, body, { headers }).subscribe({
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

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8082/parking-settings?parkingId=${this.data.parkingId}`;
    const body = this.settingsForm.value;

    this.http.put<any>(url, body, { headers }).subscribe({
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

  onFieldChange() {
    this.isSaveEnabled = this.settingsForm.valid;
  }
}
