import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-parking-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, NgChartsModule],
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
  barChartLabels: string[] = [];
  barChartData: ChartConfiguration['data'] = {
    labels: this.barChartLabels,
    datasets: [],
  };
  barChartType: ChartType = 'bar';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.parkingId = this.route.snapshot.paramMap.get('id');
    this.fetchDashboardData('TODAY');
    this.fetchChartData('TODAY');
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
    this.fetchDashboardData(filterMap[filter]);
    this.fetchChartData(filterMap[filter]);
  }

  fetchDashboardData(filter: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8084/api/dashboard/${this.parkingId}/filtered-cards?filter=${filter}`;

    this.http.get<{ revenue: string; checkInQuantity: number; checkOutQuantity: number }>(url, { headers }).subscribe({
      next: (data) => {
        this.revenue = data.revenue;
        this.checkIns = data.checkInQuantity;
        this.checkOuts = data.checkOutQuantity;
      },
      error: (error) => {
        console.error('Erro ao buscar dados do dashboard:', error);
      },
    });
  }

  fetchChartData(filter: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8084/api/dashboard/${this.parkingId}/chart/tower/checkins-and-earnings?filter=${filter}`;

    this.http.get<{ labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] }>(url, { headers }).subscribe({
      next: (data) => {
        this.barChartLabels = data.labels;
        this.barChartData = {
          labels: data.labels,
          datasets: data.datasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
          })),
        };
      },
      error: (error) => {
        console.error('Erro ao buscar dados do gráfico:', error);
      },
    });
  }
}
