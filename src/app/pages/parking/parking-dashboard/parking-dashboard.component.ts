import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-parking-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, NgChartsModule],
  templateUrl: './parking-dashboard.component.html',
  styleUrls: ['./parking-dashboard.component.scss']
})
export class ParkingDashboardComponent implements OnInit {
  selectedFilter: string = 'Hoje';
  parkingId: string | null = null;

  revenue: string = 'R$ 0,00';
  checkIns: number = 0;
  checkOuts: number = 0;

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  barChartType: ChartType = 'bar';

  checkinsBarChartLabels: string[] = [];
  checkinsBarChartData: ChartConfiguration['data'] = {
    labels: this.checkinsBarChartLabels,
    datasets: [],
  };

  earningsBarChartLabels: string[] = [];
  earningsBarChartData: ChartConfiguration['data'] = {
    labels: this.earningsBarChartLabels,
    datasets: [],
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.parkingId = this.route.snapshot.paramMap.get('id');
    this.fetchCardsData('TODAY');
    this.fetchCheckinsTowerChartData('TODAY');
    this.fetchEarningsTowerChartData('TODAY');
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
    const filterMap: { [key: string]: string } = {
      'Hoje': 'TODAY',
      'Ontem': 'YESTERDAY',
      'Esta semana': 'THIS_WEEK',
      'Este mês': 'THIS_MONTH',
      'Últimos 30 dias': 'LAST_30_DAYS',
      'Todo': 'ALL',
    };
    this.fetchCardsData(filterMap[filter]);
    this.fetchCheckinsTowerChartData(filterMap[filter]);
    this.fetchEarningsTowerChartData(filterMap[filter]);
  }

  fetchCardsData(filter: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.dashboardService.getFilteredCards(this.parkingId!, filter!, headers).subscribe({
      next: (data) => {
        this.revenue = data.revenue;
        this.checkIns = data.checkInQuantity;
        this.checkOuts = data.checkOutQuantity;
      },
      error: (error) => {
        this.snackBar.open('Erro ao buscar dados dos cards', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  fetchCheckinsTowerChartData(filter: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.dashboardService.getCheckinsTowerChart(this.parkingId!, filter!, headers).subscribe({
      next: (data: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] }) => {
        this.checkinsBarChartLabels = data.labels;
        this.checkinsBarChartData = {
          labels: data.labels,
          datasets: data.datasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
          })),
        };
      },
      error: (error) => {
        this.snackBar.open('Erro ao buscar dados do gráfico de Check-ins', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }
  
  fetchEarningsTowerChartData(filter: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.dashboardService.getEarningsTowerChart(this.parkingId!, filter!, headers).subscribe({
      next: (data: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] }) => {
        this.earningsBarChartLabels = data.labels;
        this.earningsBarChartData = {
          labels: data.labels,
          datasets: data.datasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
          })),
        };
      },
      error: (error) => {
        this.snackBar.open('Erro ao buscar dados do gráfico de Ganhos', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }
}
