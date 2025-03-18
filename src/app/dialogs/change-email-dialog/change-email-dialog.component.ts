import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-change-email-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './change-email-dialog.component.html',
  styleUrls: ['./change-email-dialog.component.scss']
})
export class ChangeEmailDialogComponent {
  changeEmailForm: FormGroup;
  isSaveEnabled: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangeEmailDialogComponent>,
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: { onSuccess: () => void }
  ) {
    this.changeEmailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });
  }

  onFieldChange() {
    this.isSaveEnabled = this.changeEmailForm.valid;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveEmail() {
    if (this.changeEmailForm.invalid) {
      this.changeEmailForm.markAllAsTouched();
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      newEmail: this.changeEmailForm.get('newEmail')?.value
    };

    this.usersService.changeCurrentUserEmail(body, headers).subscribe({
      next: (response) => {
        this.snackBar.open('E-mail alterado com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.authService.setToken(response.accessToken);
        this.dialogRef.close();
        this.data.onSuccess();
      },
      error: (error) => {
        if (error.status === 406) {
          this.snackBar.open('Este já é seu e-mail atual.', 'Fechar', {
            duration: 3000,
          });
        } else if (error.status === 409) {
          this.snackBar.open('Este e-mail já é usado por outra conta.', 'Fechar', {
            duration: 3000,
          });
        } else {
          this.snackBar.open('Erro ao tentar alterar o e-mail.', 'Fechar', {
            duration: 3000,
          });
        }
      },
    });
  }
}
