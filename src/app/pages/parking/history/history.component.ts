import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HistoryDetailsDialogComponent } from '../../../dialogs/history-details-dialog/history-details-dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatDialogModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  historyData: any[] = [];
  errorMessage: string | null = null;
  parkingId: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private http: HttpClient, private authService: AuthService, private route: ActivatedRoute, public dialog: MatDialog, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Histórico | Gerenciador de Estacionamento');
    this.parkingId = this.getParkingIdFromRoute();
    if (this.parkingId) {
      this.loadHistory(this.currentPage);
    }
  }

  getParkingIdFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  loadHistory(page: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8083/parked-vehicle/history?parkingId=${this.parkingId}&page=${page}&sizePage=6`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        this.historyData = data.content;
        this.totalPages = data.totalPages;
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar histórico';
      },
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadHistory(page);
    }
  }

  openHistoryDetailsDialog(parkedVehicleId: string) {
    const dialogRef = this.dialog.open(HistoryDetailsDialogComponent, {
      data: { parkedVehicleId }
    });
  }
}
