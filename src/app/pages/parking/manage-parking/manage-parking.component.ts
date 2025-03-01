import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ParkingService } from '../../../services/parking.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDeleteDialogComponent } from '../../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { AddVehicleDialogComponent } from '../../../dialogs/add-vehicle-dialog/add-vehicle-dialog.component';
import { VehicleDetailsDialogComponent } from '../../../dialogs/vehicle-details-dialog/vehicle-details-dialog.component';

@Component({
  selector: 'app-manage-parking',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatDialogModule],
  templateUrl: './manage-parking.component.html',
  styleUrls: ['./manage-parking.component.scss'],
})
export class ManageParkingComponent implements OnInit {
  parkingId: string | null = null;
  parkingData: any;
  parkedVehicles: any[] = [];
  isLoading = true;
  isOwner = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private parkingService: ParkingService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.parkingId = this.route.snapshot.paramMap.get('id');
    if (this.parkingId) {
      this.loadParkingDetails();
      this.loadParkedVehicles();
    }
  }

  loadParkingDetails() {
    const token = this.authService.getToken();
    const userId = this.authService.getUserId();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.parkingService.getParkingById(this.parkingId!, headers).subscribe({
      next: (data) => {
        this.parkingData = data;
        this.isOwner = data.userCreatorId === userId;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  loadParkedVehicles() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8083/parked-vehicle/parking/${this.parkingId}`;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.parkedVehicles = data.sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
        this.errorMessage = null;
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage = 'Nenhum veículo estacionado';
        } else {
          this.errorMessage = 'Erro ao carregar veículos estacionados';
        }
      },
    });
  }

  openAddVehicleDialog() {
    const dialogRef = this.dialog.open(AddVehicleDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addVehicle(result);
      }
    });
  }

  addVehicle(vehicleData: any) {
    const token = this.authService.getToken();
    const userId = this.authService.getUserId();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      ...vehicleData,
      parkingId: this.parkingId,
      checkinEmployeeId: userId
    };

    this.http.post<any>('http://localhost:8083/parked-vehicle/checkin', body, { headers }).subscribe({
      next: (data) => {
        this.parkedVehicles.unshift(data);
      },
      error: () => {
        this.errorMessage = 'Erro ao adicionar veículo';
      }
    });
  }

  openVehicleDetailsDialog(vehicle: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8083/parked-vehicle/${vehicle.id}/checkin`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        const dialogRef = this.dialog.open(VehicleDetailsDialogComponent, {
          data: {
            ...vehicle,
            checkinEmployeeName: data.checkinEmployeeName,
            checkinDate: data.checkinDate
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.success) {
            this.parkedVehicles = this.parkedVehicles.filter(v => v.id !== result.id);
          }
        });
      },
      error: (error) => {
        console.error("Error loading vehicle details:", error);
      }
    });
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteParking();
      }
    });
  }

  deleteParking() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.parkingService.deleteParkingById(this.parkingId!, headers).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // Handle error
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
}
