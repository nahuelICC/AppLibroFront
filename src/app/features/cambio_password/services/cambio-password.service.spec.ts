import { TestBed } from '@angular/core/testing';

import { CambioPasswordService } from './cambio-password.service';

describe('CambioPasswordService', () => {
  let service: CambioPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambioPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
