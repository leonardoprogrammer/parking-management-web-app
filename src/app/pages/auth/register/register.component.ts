import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        cpf: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator } // 🔥 Adiciona a validação personalizada
    );
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const { confirmPassword, ...userData } = this.registerForm.value; // Remove confirmPassword antes de enviar

    console.log('Enviando dados:', userData); // Apenas para teste

    // Simulando um delay para exibir carregamento
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/login']); // Redireciona para login após cadastro
    }, 1500);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
