import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ResetPasswordService } from '../../../services/reset-password/reset-password.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  message: string | null = null;
  showForm = false;
  email: string | null = null;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private resetPasswordService: ResetPasswordService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Redefinir Senha | Gerenciador de Estacionamento');
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.id = this.route.snapshot.queryParamMap.get('id');

    if (this.email && this.id) {
      this.confirmResetRequest(this.email, this.id);
    } else {
      this.message = 'Parâmetros inválidos.';
    }
  }

  confirmResetRequest(email: string, id: string): void {
    this.isLoading = true;
    this.resetPasswordService.confirmResetRequest(email, id).subscribe({
      next: () => {
        this.showForm = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.message = error.error || 'Ocorreu um erro. Tente novamente mais tarde.';
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) return;

    const { password, confirmPassword } = this.resetPasswordForm.value;
    if (password !== confirmPassword) {
      this.message = 'As senhas não coincidem.';
      return;
    }

    this.isLoading = true;
    this.message = null;

    const body = {
      email: this.email,
      id: this.id,
      newPassword: password
    };

    this.resetPasswordService.resetPassword(body).subscribe({
      next: () => {
        this.message = 'Senha redefinida com sucesso.';
        this.isLoading = false;
        this.showForm = false;
      },
      error: (error) => {
        this.message = error.error || 'Ocorreu um erro. Tente novamente mais tarde.';
        this.isLoading = false;
      },
    });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'mismatch': true };
    }
    return null;
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
