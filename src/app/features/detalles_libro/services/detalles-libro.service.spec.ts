import { TestBed } from '@angular/core/testing';

import { DetallesLibroService } from './detalles-libro.service';

describe('DetallesLibroService', () => {
  let service: DetallesLibroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesLibroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
