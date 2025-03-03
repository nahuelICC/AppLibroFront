// src/app/core/interceptors/auth-interceptor.interceptor.ts
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';

/**
 * Interceptor que añade el token de autenticación a las peticiones
 * @param request
 * @param next
 */
export const authInterceptorInterceptor = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthServiceService);
  const token = authService.getToken();

  if (request.method !== 'OPTIONS' && token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request);
};
