import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ResetPasswordService } from '../../../services/reset-password/reset-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Esqueci minha senha | Gerenciador de Estacionamento');
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading = true;
    this.message = null;

    const email = this.forgotPasswordForm.value.email;
    this.resetPasswordService.requestResetPassword(email).subscribe({
      next: () => {
        this.message = 'Link enviado. Verifique seu e-mail.';
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.message = 'Não há conta com este e-mail.';
        } else {
          this.message = 'Ocorreu um erro. Tente novamente mais tarde.';
        }
        this.isLoading = false;
      },
    });
  }
}
