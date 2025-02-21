import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // 🔥 Importando CommonModule para habilitar *ngIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {}

  isAuthenticated(): boolean {
    return !!this.authService.getToken(); // Retorna true se o usuário estiver autenticado
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
