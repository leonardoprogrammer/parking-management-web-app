import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ParkingService } from '../../../services/parking.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manage-parking',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './manage-parking.component.html',
  styleUrl: './manage-parking.component.scss',
})
export class ManageParkingComponent implements OnInit {
  parkingId: string | null = null;
  parkingData: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private parkingService: ParkingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.parkingId = this.route.snapshot.paramMap.get('id');
    if (this.parkingId) {
      this.loadParkingDetails();
    }
  }

  loadParkingDetails() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.parkingService.getParkingById(this.parkingId!, headers).subscribe({
      next: (data) => {
        this.parkingData = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  viewSlots() {
    // Lógica para visualizar vagas
  }

  viewEmployees() {
    // Lógica para visualizar funcionários
  }

  viewSettings() {
    // Lógica para visualizar configurações
  }
}
