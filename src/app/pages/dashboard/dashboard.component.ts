import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.loadParkings();
  }

  loadParkings() {
    this.http.get<any[]>('http://localhost:8080/parkings/user').subscribe({
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  editProfile() {
    this.router.navigate(['/profile']);
  }
}
