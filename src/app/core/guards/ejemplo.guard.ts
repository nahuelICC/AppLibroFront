import { CanActivateFn } from '@angular/router';

export const ejemploGuard: CanActivateFn = (route, state) => {
  return true;
};
