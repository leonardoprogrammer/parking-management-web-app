import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeePermissionsService {
  private apiUrl = 'http://localhost:8082/employee-permissions';

  constructor(private http: HttpClient) { }

  getCurrentUserPermissions(parkingId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/currentUser?parkingId=${parkingId}`;
    return this.http.get<any>(url, { headers });
  }

  updateEmployeePermissions(employeeId: string, body: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}?employeeId=${employeeId}`;
    return this.http.put<any>(url, body, { headers });
  }
}
