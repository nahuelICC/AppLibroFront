// src/app/core/interceptors/auth-interceptor.interceptor.ts
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';

export const authInterceptorInterceptor = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthServiceService);
  const token = authService.getToken();

  console.log('Interceptor ejecutándose'); // Depuración
  console.log('Token obtenido:', token); // Depuración

  // Evita modificar las solicitudes preflight (OPTIONS)
  if (request.method !== 'OPTIONS' && token) {
    console.log('Token agregado a la solicitud:', token); // Depuración
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request);
};
