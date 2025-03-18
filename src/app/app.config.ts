import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { authInterceptor } from './interceptors/auth-interceptor.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    provideNgxMask(),
    provideAnimationsAsync()
  ]
};
