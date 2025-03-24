import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private apiUrl = 'http://localhost:8081/api/reset-password';

  constructor(private http: HttpClient) { }

  confirmResetRequest(email: string, id: string): Observable<any> {
    const url = `${this.apiUrl}/confirm?email=${email}&id=${id}`;
    return this.http.get(url, { responseType: 'text' });
  }

  resetPassword(body: any): Observable<any> {
    return this.http.post(this.apiUrl, body, { responseType: 'text' });
  }

  requestResetPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/request?email=${email}`;
    return this.http.post(url, {}, { responseType: 'text' });
  }
}
