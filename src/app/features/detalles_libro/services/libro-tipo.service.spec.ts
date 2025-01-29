import { TestBed } from '@angular/core/testing';

import { LibroTipoService } from './libro-tipo.service';

describe('LibroTipoService', () => {
  let service: LibroTipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibroTipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
