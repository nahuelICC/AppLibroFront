import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';

export const authInterceptorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthServiceService);
  const token = authService.getToken();

  // Avoid modifying preflight (OPTIONS) requests
  if (request.method !== 'OPTIONS' && token) {
    console.log('Token:', token); // Verifica que el token se esté obteniendo correctamente
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  return next(request);
};
