import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../../dialogs/change-password-dialog/change-password-dialog.component';
import { ChangeEmailDialogComponent } from '../../dialogs/change-email-dialog/change-email-dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, ReactiveFormsModule, NgxMaskDirective, MatDialogModule],
  providers: [provideNgxMask()],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  profile: any = null;
  originalProfile: any = null;
  errorMessage: string | null = null;
  isEditEnabled: boolean = false;
  isSaveEnabled: boolean = false;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private titleService: Title
  ) {
    this.profileForm = this.fb.group({
      userName: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      userCpf: [{ value: '', disabled: true }],
      userEmail: [{ value: '', disabled: true }],
      userTelephone: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      createdAt: [{ value: '', disabled: true }],
      updatedAt: [{ value: '', disabled: true }]
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Perfil | Gerenciador de Estacionamento');
    this.loadProfile();
  }

  loadProfile() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.usersService.getCurrentUser(headers).subscribe({
      next: (data) => {
        this.profile = data;
        this.originalProfile = { ...data };
        this.profileForm.patchValue({
          ...data,
          userTelephone: this.formatTelephone(data.userTelephone),
          createdAt: this.formatDate(data.createdAt),
          updatedAt: data.updatedAt ? this.formatDate(data.updatedAt) : ''
        });
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao tentar recuperar informações do perfil';
        this.snackBar.open(this.errorMessage, 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  formatTelephone(telephone: string): string {
    return telephone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }

  enableEdit() {
    this.isEditEnabled = true;
    this.profileForm.get('userName')?.enable();
    this.profileForm.get('userTelephone')?.enable();
  }

  cancelEdit() {
    this.isEditEnabled = false;
    this.isSaveEnabled = false;
    this.profileForm.patchValue({
      ...this.originalProfile,
      userTelephone: this.formatTelephone(this.originalProfile.userTelephone),
      createdAt: this.formatDate(this.originalProfile.createdAt),
      updatedAt: this.originalProfile.updatedAt ? this.formatDate(this.originalProfile.updatedAt) : ''
    });
    this.profileForm.get('userName')?.disable();
    this.profileForm.get('userTelephone')?.disable();
  }

  onFieldChange() {
    const userNameDirty = this.profileForm.get('userName')?.dirty ?? false;
    const userTelephoneDirty = this.profileForm.get('userTelephone')?.dirty ?? false;
    const userNameValid = this.profileForm.get('userName')?.valid ?? false;
    const userTelephoneValid = this.profileForm.get('userTelephone')?.valid ?? false;

    this.isSaveEnabled = (userNameDirty && userNameValid) || (userTelephoneDirty && userTelephoneValid);
  }

  saveProfile() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      name: this.profileForm.get('userName')?.value,
      telephone: this.profileForm.get('userTelephone')?.value.replace(/\D/g, '')
    };

    this.usersService.updateUserProfile(headers, body).subscribe({
      next: () => {
        this.snackBar.open('Informações alteradas com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.isEditEnabled = false;
        this.isSaveEnabled = false;
        this.profileForm.get('userName')?.disable();
        this.profileForm.get('userTelephone')?.disable();
        this.loadProfile();
      },
      error: (error) => {
        this.errorMessage = 'Erro ao tentar editar informações';
        this.snackBar.open(this.errorMessage, 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      data: {
        onSuccess: () => this.loadProfile()
      }
    });
  }

  changeEmail() {
    const dialogRef = this.dialog.open(ChangeEmailDialogComponent, {
      data: {
        onSuccess: () => this.loadProfile()
      }
    });
  }
}
