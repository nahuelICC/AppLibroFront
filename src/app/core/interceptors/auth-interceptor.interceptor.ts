import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {inject} from '@angular/core';
import {AuthServiceService} from '../services/auth-service.service';

export const authInterceptorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  console.log(request.url);
  const authService = inject(AuthServiceService);
  const token = authService.getToken();
  if (token) {
    request = request.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`,
      }
    });
  }
  return next(request);
};
