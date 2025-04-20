import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:8084/api/dashboard';

  constructor(private http: HttpClient) { }

  getFilteredCards(parkingId: string, filter: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.apiUrl}/${parkingId}/filtered-cards?filter=${filter}`, { headers });
  }

  getCheckinsTowerChart(parkingId: string, filter: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.apiUrl}/${parkingId}/chart/tower/checkins?filter=${filter}`, { headers });
  }

  getEarningsTowerChart(parkingId: string, filter: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.apiUrl}/${parkingId}/chart/tower/earnings?filter=${filter}`, { headers });
  }
}
