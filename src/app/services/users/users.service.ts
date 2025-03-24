import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  getCurrentUser(headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/currentUser`;
    return this.http.get<any>(url, { headers });
  }

  updateUserProfile(headers: HttpHeaders, body: any): Observable<any> {
    const url = `${this.apiUrl}/currentUser`;
    return this.http.put<any>(url, body, { headers });
  }

  changeCurrentUserPassword(body: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/changeCurrentUserPassword`;
    return this.http.put<any>(url, body, { headers });
  }

  changeCurrentUserEmail(body: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/changeCurrentUserEmail`;
    return this.http.put<any>(url, body, { headers });
  }

  searchUsers(parkingId: string, name: string, email: string, cpf: string, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}/search?parkingId=${parkingId}&name=${name}&email=${email}&cpf=${cpf}`;
    return this.http.get<any[]>(url, { headers });
  }
}
