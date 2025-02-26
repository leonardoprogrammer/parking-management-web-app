import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading = true;
    this.message = null;

    const email = this.forgotPasswordForm.value.email;
    this.http.post(`http://localhost:8081/reset-password/request?email=${email}`, {}, { responseType: 'text' }).subscribe({
      next: (response) => {
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