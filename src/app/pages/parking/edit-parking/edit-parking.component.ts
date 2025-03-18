import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ParkingService } from '../../../services/parking.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDeleteDialogComponent } from '../../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { EditParkingSettingsComponent } from '../../../dialogs/edit-parking-settings/edit-parking-settings.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-parking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-parking.component.html',
  styleUrls: ['./edit-parking.component.scss']
})
export class EditParkingComponent implements OnInit {
  parkingForm: FormGroup;
  parkingId: string | null = null;
  parkingData: any;
  isLoading = true;
  isEditEnabled: boolean = false;
  isSaveEnabled: boolean = false;
  lastUpdated: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private parkingService: ParkingService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private titleService: Title
  ) {
    this.parkingForm = this.fb.group({
      parkingName: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      parkingAddress: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Editar Estacionamento | Gerenciador de Estacionamento');
    this.parkingId = this.route.snapshot.paramMap.get('id');
    if (this.parkingId) {
      this.loadParkingDetails();
    }
  }

  loadParkingDetails() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.parkingService.getParkingById(this.parkingId!, headers).subscribe({
      next: (data) => {
        this.parkingData = data;
        this.parkingForm.patchValue({
          parkingName: data.name,
          parkingAddress: data.address
        });
        this.lastUpdated = data.updatedAt ? formatDate(data.updatedAt, 'dd/MM/yyyy', 'en-US') : null;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao tentar recuperar informações do estacionamento', 'Fechar', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  enableEdit() {
    this.isEditEnabled = true;
    this.parkingForm.get('parkingName')?.enable();
    this.parkingForm.get('parkingAddress')?.enable();
  }

  cancelEdit() {
    this.isEditEnabled = false;
    this.isSaveEnabled = false;
    this.parkingForm.patchValue({
      parkingName: this.parkingData.name,
      parkingAddress: this.parkingData.address
    });
    this.parkingForm.get('parkingName')?.disable();
    this.parkingForm.get('parkingAddress')?.disable();
  }

  onFieldChange() {
    const parkingName = this.parkingForm.get('parkingName')?.value ?? '';
    const parkingAddress = this.parkingForm.get('parkingAddress')?.value ?? '';
    const parkingNameValid = parkingName.length >= 3;
    const parkingAddressValid = parkingAddress.length >= 5;

    this.isSaveEnabled = parkingNameValid && parkingAddressValid;
  }

  saveParking() {
    if (this.parkingForm.invalid) {
      this.parkingForm.markAllAsTouched();
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      parkingName: this.parkingForm.get('parkingName')?.value,
      parkingAddress: this.parkingForm.get('parkingAddress')?.value
    };

    this.parkingService.updateParking(this.parkingId!, body, headers).subscribe({
      next: () => {
        this.snackBar.open('Informações alteradas com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.isEditEnabled = false;
        this.isSaveEnabled = false;
        this.parkingForm.get('parkingName')?.disable();
        this.parkingForm.get('parkingAddress')?.disable();
        this.loadParkingDetails();
      },
      error: (error) => {
        console.log('Error:', error);
        this.snackBar.open('Erro ao tentar editar informações', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteParking();
      }
    });
  }

  deleteParking() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.parkingService.deleteParkingById(this.parkingId!, headers).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log('Error:', error);
      },
    });
  }

  editSettings() {
    const dialogRef = this.dialog.open(EditParkingSettingsComponent, {
      data: { parkingId: this.parkingId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Configurações atualizadas com sucesso!', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }
}
