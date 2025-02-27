import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ParkingService } from '../../../services/parking.service';

@Component({
  selector: 'app-create-parking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './create-parking.component.html',
  styleUrl: './create-parking.component.scss',
})
export class CreateParkingComponent {
  parkingForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private parkingService: ParkingService, private router: Router) {
    this.parkingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    if (this.parkingForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.parkingService.createParking(this.parkingForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Erro ao criar estacionamento!';
        this.isLoading = false;
      },
    });
  }
}
