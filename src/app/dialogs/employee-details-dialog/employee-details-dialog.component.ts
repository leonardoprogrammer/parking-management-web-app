import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeService } from '../../services/employee/employee.service';
import { EmployeePermissionsService } from '../../services/employee-permissions/employee-permissions.service';

@Component({
  selector: 'app-employee-details-dialog',
  standalone: true,
  imports: [CommonModule, MatTabsModule, FormsModule, MatSlideToggleModule, MatSnackBarModule, MatIconModule, MatButtonModule],
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
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private employeePermissionsService: EmployeePermissionsService
  ) {}

  ngOnInit() {
    this.loadEmployeeDetails();
  }

  loadEmployeeDetails() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.employeeService.getEmployeeDetails(this.data.employeeId, headers).subscribe({
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
    const body = {
      canCheckinVehicle: this.employeeDetails.permissions.canCheckinVehicle,
      canCheckoutVehicle: this.employeeDetails.permissions.canCheckoutVehicle,
      canAddEmployee: this.employeeDetails.permissions.canAddEmployee,
      canEditParking: this.employeeDetails.permissions.canEditParking
    };

    this.employeePermissionsService.updateEmployeePermissions(this.employeeDetails.employeeId, body, headers).subscribe({
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

  removeEmployee() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.employeeService.removeEmployee(this.data.employeeId, headers).subscribe({
      next: () => {
        this.snackBar.open('Funcionário removido com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.closeDialog();
      },
      error: (error) => {
        this.errorMessage = 'Erro ao remover funcionário';
        this.snackBar.open('Erro ao remover funcionário', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
