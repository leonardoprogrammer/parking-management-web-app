import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParkingSettingsService {
  private apiUrl = 'http://localhost:8082/api/parking-settings';

  constructor(private http: HttpClient) { }

  getSettings(parkingId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}?parkingId=${parkingId}`;
    return this.http.get<any>(url, { headers });
  }

  createSettings(parkingId: string, body: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}?parkingId=${parkingId}`;
    return this.http.post<any>(url, body, { headers });
  }

  saveSettings(parkingId: string, body: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}?parkingId=${parkingId}`;
    return this.http.put<any>(url, body, { headers });
  }
}
