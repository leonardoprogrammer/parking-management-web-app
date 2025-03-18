import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ParkedVehicleService } from '../../services/parked-vehicle/parked-vehicle.service';

@Component({
  selector: 'app-history-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './history-details-dialog.component.html',
  styleUrls: ['./history-details-dialog.component.scss']
})
export class HistoryDetailsDialogComponent implements OnInit {
  vehicleDetails: any = null;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<HistoryDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private parkedVehicleService: ParkedVehicleService
  ) {}

  ngOnInit() {
    this.loadVehicleDetails();
  }

  loadVehicleDetails() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.parkedVehicleService.getVehicleDetails(this.data.parkedVehicleId, headers).subscribe({
      next: (data) => {
        this.vehicleDetails = data;
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar detalhes do veículo';
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
