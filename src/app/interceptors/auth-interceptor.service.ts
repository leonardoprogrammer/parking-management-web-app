import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isRefreshing = new BehaviorSubject<boolean>(false);
  const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  console.log('Intercepting request:', req.url);

  if (token && !req.url.includes('/refresh-token')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Error status:', error.status);
      console.log('Error message:', error.message);
      console.log('Error body:', error.error);
      if (error.status === 401 && error.error === 'Token expirado.') {
        return handle401Error(req, next, authService, isRefreshing, refreshTokenSubject);
      } else {
        return throwError(error);
      }
    })
  );
};

const handle401Error = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  isRefreshing: BehaviorSubject<boolean>,
  refreshTokenSubject: BehaviorSubject<any>
): Observable<HttpEvent<any>> => {
  console.log('Handling 401 error');
  if (!isRefreshing.value) {
    isRefreshing.next(true);
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: { accessToken: string }) => {
        console.log('Token refreshed:', response.accessToken);
        isRefreshing.next(false);
        refreshTokenSubject.next(response.accessToken);
        authService.setToken(response.accessToken);
        return next(request.clone({
          setHeaders: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        }));
      }),
      catchError((err) => {
        console.log('Error refreshing token:', err);
        isRefreshing.next(false);
        authService.logout();
        return throwError(err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => {
        console.log('Using refreshed token:', token);
        return next(request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        }));
      })
    );
  }
};
