import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const token = authService.getToken();
  const isRefreshing = new BehaviorSubject<boolean>(false);
  const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  if (token && !req.url.includes('/refresh-token')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.url.includes('/refresh-token')) {
        return throwError(error);
      }

      if (error.status === 0) {
        return handle401Error(req, next, authService, isRefreshing, refreshTokenSubject, snackBar, router);
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
  refreshTokenSubject: BehaviorSubject<any>,
  snackBar: MatSnackBar,
  router: Router
): Observable<HttpEvent<any>> => {
  if (!isRefreshing.value) {
    isRefreshing.next(true);
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: { newAccessToken: string; newRefreshToken: string }) => {
        isRefreshing.next(false);
        refreshTokenSubject.next(response.newAccessToken);

        authService.setToken(response.newAccessToken);
        authService.setRefreshToken(response.newRefreshToken);

        return next(request.clone({
          setHeaders: {
            Authorization: `Bearer ${response.newAccessToken}`,
          },
        }));
      }),
      catchError((err) => {
        isRefreshing.next(false);
        refreshTokenSubject.next(null);

        snackBar.open('Você foi desconectado. Refaça o login.', 'Fechar', {
          duration: 3000,
        });

        authService.logout();
        router.navigate(['/login']);

        return throwError(err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => {
        return next(request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        }));
      })
    );
  }
};
