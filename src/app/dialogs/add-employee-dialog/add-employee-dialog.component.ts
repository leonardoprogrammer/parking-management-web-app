import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-add-employee-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatListModule],
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: ['./add-employee-dialog.component.scss']
})
export class AddEmployeeDialogComponent {
  searchForm: FormGroup;
  searchResults: any[] = [];
  selectedUser: any = null;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      email: [''],
      cpf: ['']
    });
  }

  searchUsers() {
    const { name, email, cpf } = this.searchForm.value;
    if (!name && !email && !cpf) {
      this.errorMessage = 'Insira pelo menos um campo para pesquisa';
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8081/users/search?parkingId=${this.data.parkingId}&name=${name}&email=${email}&cpf=${cpf}`;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.searchResults = data;
        this.errorMessage = null;
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage = 'Nenhum usuário encontrado.';
        } else {
          this.errorMessage = 'Houve um problema ao tentar pesquisar usuários.';
        }
      },
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
  }

  addUser() {
    if (!this.selectedUser) {
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8082/employee?parkingId=${this.data.parkingId}&userId=${this.selectedUser.userId}`;

    this.http.post<any>(url, {}, { headers }).subscribe({
      next: () => {
        this.dialogRef.close({ success: true });
      },
      error: (error) => {
        this.errorMessage = 'Erro ao adicionar novo funcionário.';
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
