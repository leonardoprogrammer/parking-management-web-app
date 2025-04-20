import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ParkingService } from '../../../services/parking/parking.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-parking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './create-parking.component.html',
  styleUrls: ['./create-parking.component.scss'],
})
export class CreateParkingComponent {
  parkingForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private parkingService: ParkingService,
    private authService: AuthService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle('Criar Estacionamento | Gerenciador de Estacionamento');
    this.parkingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    if (this.parkingForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const userId = this.authService.getUserId();
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      userCreatorId: userId,
      name: this.parkingForm.value.name,
      address: this.parkingForm.value.address,
    };

    this.parkingService.createParking(body, headers).subscribe({
      next: (response: any) => {
        this.router.navigate(['/manage', response.id]);
      },
      error: () => {
        this.errorMessage = 'Erro ao criar estacionamento!';
        this.isLoading = false;
      },
    });
  }
}
