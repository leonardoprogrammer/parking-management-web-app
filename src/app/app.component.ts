import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { provideNgxMask } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, HeaderComponent, MatDialogModule, CurrencyMaskModule],
  providers: [
    provideNgxMask(),
    Title
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {}

  isAuthenticated(): boolean {
    return !!this.authService.getToken();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
