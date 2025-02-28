import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ParkingService } from '../../../services/parking.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDeleteDialogComponent } from '../../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-manage-parking',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatDialogModule],
  templateUrl: './manage-parking.component.html',
  styleUrl: './manage-parking.component.scss',
})
export class ManageParkingComponent implements OnInit {
  parkingId: string | null = null;
  parkingData: any;
  isLoading = true;
  isOwner = false;

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
