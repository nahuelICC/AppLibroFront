import { TestBed } from '@angular/core/testing';

import { LibroServiceService } from './libro-service.service';

describe('LibroServiceService', () => {
  let service: LibroServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibroServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
