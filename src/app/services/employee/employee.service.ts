import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8082/employee';

  constructor(private http: HttpClient) { }

  getEmployeesByParkingId(parkingId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/parking/${parkingId}`;
    return this.http.get<any>(url, { headers });
  }

  removeEmployee(employeeId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/${employeeId}`;
    return this.http.delete<any>(url, { headers });
  }

  getEmployeeDetails(employeeId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/${employeeId}`;
    return this.http.get<any>(url, { headers });
  }

  addEmployee(parkingId: string, userId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}?parkingId=${parkingId}&userId=${userId}`;
    return this.http.post<any>(url, {}, { headers });
  }
}
