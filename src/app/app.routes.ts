import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManageParkingComponent } from './pages/parking/manage-parking/manage-parking.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { authGuard } from './guards/auth-guard.service';
import { noAuthGuard } from './guards/no-auth-guard.service';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [noAuthGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [noAuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'manage/:id', component: ManageParkingComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];