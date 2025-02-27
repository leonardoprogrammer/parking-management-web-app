import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  private apiUrl = 'http://localhost:8082/parking';

  constructor(private http: HttpClient) {}

  getParkingById(parkingId: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.apiUrl}/${parkingId}`, { headers });
  }

  createParking(parkingData: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, parkingData, { headers });
  }
}
