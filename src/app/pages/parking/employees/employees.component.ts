import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeDetailsDialogComponent } from '../../../dialogs/employee-details-dialog/employee-details-dialog.component';
import { AddEmployeeDialogComponent } from '../../../dialogs/add-employee-dialog/add-employee-dialog.component';
import { ConfirmRemoveEmployeeDialogComponent } from '../../../dialogs/confirm-remove-employee-dialog/confirm-remove-employee-dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSnackBarModule, MatIconModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  ownerName: string | null = null;
  employees: any[] = [];
  errorMessage: string | null = null;
  parkingId: string | null = null;
  canAddEmployee: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Funcionários | Gerenciador de Estacionamento');
    this.parkingId = this.route.snapshot.paramMap.get('id');
    if (this.parkingId) {
      this.checkPermissions();
      this.loadEmployees();
    }
  }

  loadEmployees() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8082/employee/parking/${this.parkingId}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        this.ownerName = data.ownerName;
        this.employees = data.employees;
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar funcionários';
      },
    });
  }

  checkPermissions() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8082/employee-permissions/currentUser?parkingId=${this.parkingId}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        this.canAddEmployee = data.canAddEmployee;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao verificar permissões', error);
      },
    });
  }

  openEmployeeDetailsDialog(employeeId: string) {
    const dialogRef = this.dialog.open(EmployeeDetailsDialogComponent, {
      data: { employeeId }
    });
  }

  openAddEmployeeDialog() {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      data: { parkingId: this.parkingId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.loadEmployees();
      }
    });
  }

  confirmRemoveEmployee(employeeId: string) {
    const dialogRef = this.dialog.open(ConfirmRemoveEmployeeDialogComponent, {
      data: { employeeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeEmployee(employeeId);
      }
    });
  }

  removeEmployee(employeeId: string) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8082/employee/${employeeId}`;

    this.http.delete<any>(url, { headers }).subscribe({
      next: () => {
        this.snackBar.open('Funcionário removido com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.loadEmployees();
      },
      error: (error) => {
        this.errorMessage = 'Erro ao remover funcionário';
        this.snackBar.open('Erro ao remover funcionário', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }
}
