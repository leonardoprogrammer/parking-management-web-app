import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-parking-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, NgChartsModule],
  templateUrl: './parking-dashboard.component.html',
  styleUrls: ['./parking-dashboard.component.scss']
})
export class ParkingDashboardComponent {
  selectedFilter: string = 'Hoje';

  // Dados dos cards
  revenue: number = 1500.75;
  checkIns: number = 25;
  checkOuts: number = 20;

  // Configuração do gráfico
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  barChartLabels: string[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  barChartData: ChartConfiguration['data'] = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [5, 10, 15, 20, 25, 30, 35],
        label: 'Veículos Estacionados',
        backgroundColor: '#007bff',
      },
    ],
  };
  barChartType: ChartType = 'bar';

  // Método para selecionar o filtro
  selectFilter(filter: string): void {
    this.selectedFilter = filter;
    // Atualize os dados dos cards e do gráfico com base no filtro selecionado
    this.updateDashboardData(filter);
  }

  // Método para atualizar os dados do dashboard
  updateDashboardData(filter: string): void {
    // Simulação de atualização de dados com base no filtro
    switch (filter) {
      case 'Hoje':
        this.revenue = 1500.75;
        this.checkIns = 25;
        this.checkOuts = 20;
        this.barChartData.datasets[0].data = [5, 10, 15, 20, 25, 30, 35];
        break;
      case 'Ontem':
        this.revenue = 1200.50;
        this.checkIns = 20;
        this.checkOuts = 18;
        this.barChartData.datasets[0].data = [4, 8, 12, 16, 20, 24, 28];
        break;
      case 'Esta semana':
        this.revenue = 8000.00;
        this.checkIns = 150;
        this.checkOuts = 140;
        this.barChartData.datasets[0].data = [20, 30, 40, 50, 60, 70, 80];
        break;
      case 'Este mês':
        this.revenue = 32000.00;
        this.checkIns = 600;
        this.checkOuts = 580;
        this.barChartData.datasets[0].data = [100, 120, 140, 160, 180, 200, 220];
        break;
      case 'Últimos 30 dias':
        this.revenue = 31000.00;
        this.checkIns = 590;
        this.checkOuts = 570;
        this.barChartData.datasets[0].data = [90, 110, 130, 150, 170, 190, 210];
        break;
      case 'Todo':
        this.revenue = 100000.00;
        this.checkIns = 2000;
        this.checkOuts = 1950;
        this.barChartData.datasets[0].data = [300, 400, 500, 600, 700, 800, 900];
        break;
    }
  }
}
