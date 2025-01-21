import { HttpInterceptorFn } from '@angular/common/http';

export const ejemploInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
