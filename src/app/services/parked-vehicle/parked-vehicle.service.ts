import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParkedVehicleService {
  private apiUrl = 'http://localhost:8083/api/parked-vehicle';

  constructor(private http: HttpClient) { }

  getParkedVehiclesByParkingId(parkingId: string, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}/parking/${parkingId}`;
    return this.http.get<any[]>(url, { headers });
  }

  addVehicle(vehicleData: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/checkin`;
    return this.http.post<any>(url, vehicleData, { headers });
  }

  getVehicleDetails(vehicleId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/${vehicleId}`;
    return this.http.get<any>(url, { headers });
  }

  getVehicleCheckInDetails(vehicleId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/${vehicleId}/checkin`;
    return this.http.get<any>(url, { headers });
  }

  getHistory(parkingId: string, page: number, sizePage: number, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/history?parkingId=${parkingId}&page=${page}&sizePage=${sizePage}`;
    return this.http.get<any>(url, { headers });
  }

  checkoutVehicle(body: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/checkout`;
    return this.http.post<any>(url, body, { headers });
  }
}
