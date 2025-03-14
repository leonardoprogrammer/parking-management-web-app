import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  parkings: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient, private authService: AuthService, public router: Router, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Dashboard | Gerenciador de Estacionamento');
    this.loadParkings();
  }

  loadParkings() {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8082/parking/user/${userId}`;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.parkings = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  createParking() {
    this.router.navigate(['/create-parking']);
  }

  navigateToParking(parkingId: string) {
    this.router.navigate(['/manage', parkingId]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  editProfile() {
    this.router.navigate(['/profile']);
  }
}
