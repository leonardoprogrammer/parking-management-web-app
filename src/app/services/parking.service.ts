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

  getParkingsByUserId(userId: string, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get<any[]>(url, { headers });
  }

  createParking(parkingData: any, headers: HttpHeaders): Observable<any> {
    return this.http.post(this.apiUrl, parkingData, { headers });
  }

  deleteParkingById(parkingId: string, headers: HttpHeaders): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${parkingId}`, { headers });
  }

  updateParking(parkingId: string, body: any, headers: HttpHeaders): Observable<any> {
    return this.http.put(`${this.apiUrl}/${parkingId}`, body, { headers });
  }
}
