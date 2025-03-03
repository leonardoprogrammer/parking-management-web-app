import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-details-dialog',
  standalone: true,
  imports: [CommonModule, MatTabsModule, FormsModule, MatSlideToggleModule, MatSnackBarModule],
  templateUrl: './employee-details-dialog.component.html',
  styleUrls: ['./employee-details-dialog.component.scss']
})
export class EmployeeDetailsDialogComponent implements OnInit {
  employeeDetails: any = null;
  errorMessage: string | null = null;
  isSaveEnabled: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EmployeeDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEmployeeDetails();
  }

  loadEmployeeDetails() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8082/employee/${this.data.employeeId}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        this.employeeDetails = data;
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar detalhes do funcionário';
      },
    });
  }

  enableSaveButton() {
    this.isSaveEnabled = true;
  }

  savePermissions() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8082/employee-permissions?employeeId=${this.employeeDetails.employeeId}`;
    const body = {
      canCheckinVehicle: this.employeeDetails.permissions.canCheckinVehicle,
      canCheckoutVehicle: this.employeeDetails.permissions.canCheckoutVehicle,
      canAddEmployee: this.employeeDetails.permissions.canAddEmployee,
      canEditParking: this.employeeDetails.permissions.canEditParking
    };

    this.http.put<any>(url, body, { headers }).subscribe({
      next: (data) => {
        this.isSaveEnabled = false;
        this.snackBar.open('Permissões salvas com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.closeDialog();
      },
      error: (error) => {
        this.errorMessage = 'Erro ao salvar permissões';
        this.snackBar.open('Erro ao salvar permissões', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
