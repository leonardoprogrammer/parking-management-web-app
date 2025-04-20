import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent {
  changePasswordForm: FormGroup;
  isSaveEnabled: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: { onSuccess: () => void }
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmNewPassword')?.value
      ? null : { mismatch: true };
  }

  onFieldChange() {
    const passwordMatch = this.passwordMatchValidator(this.changePasswordForm);
    this.isSaveEnabled = this.changePasswordForm.valid && !passwordMatch?.mismatch;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  savePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      currentPassword: this.changePasswordForm.get('currentPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value
    };

    this.usersService.changeCurrentUserPassword(body, headers).subscribe({
      next: (response) => {
        this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.authService.setToken(response.newAccessToken);
        this.authService.setRefreshToken(response.newRefreshToken);
        this.dialogRef.close();
        this.data.onSuccess();
      },
      error: (error) => {
        if (error.status === 406) {
          this.snackBar.open('Senha atual incorreta.', 'Fechar', {
            duration: 3000,
          });
        } else {
          this.snackBar.open('Erro ao tentar alterar a senha.', 'Fechar', {
            duration: 3000,
          });
        }
      },
    });
  }
}
