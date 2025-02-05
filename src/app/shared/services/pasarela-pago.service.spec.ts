import { TestBed } from '@angular/core/testing';

import { PasarelaPagoService } from './pasarela-pago.service';

describe('PasarelaPagoService', () => {
  let service: PasarelaPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasarelaPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
