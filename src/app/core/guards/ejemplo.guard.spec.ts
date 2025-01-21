import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ejemploGuard } from './ejemplo.guard';

describe('ejemploGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ejemploGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
