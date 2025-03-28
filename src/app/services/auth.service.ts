import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private accessTokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userIdKey = 'user_id';
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ accessToken: string, refreshToken: string, userId: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.accessTokenKey, response.accessToken);
          localStorage.setItem(this.refreshTokenKey, response.refreshToken);
          localStorage.setItem(this.userIdKey, response.userId);
        }
        this.isAuthenticated.next(true);
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.userIdKey);
    }
    this.isAuthenticated.next(false);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.refreshTokenKey);
  }

  getUserId(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.userIdKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  private hasToken(): boolean {
    return this.getToken() !== null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.accessTokenKey, token);
    }
  }

  setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.refreshTokenKey, token);
    }
  }

  refreshToken(): Observable<{ newAccessToken: string; newRefreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<{ newAccessToken: string; newRefreshToken: string }>(
      `${this.apiUrl}/refresh-token`,
      { refreshToken }
    );
  }
}
