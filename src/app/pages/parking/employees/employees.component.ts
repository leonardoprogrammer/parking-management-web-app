import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeDetailsDialogComponent } from '../../../dialogs/employee-details-dialog/employee-details-dialog.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
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
    public dialog: MatDialog
  ) {}

  ngOnInit() {
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
}
