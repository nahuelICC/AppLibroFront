import { TestBed } from '@angular/core/testing';

import { ResenyaService } from './resenya.service';

describe('ResenyaService', () => {
  let service: ResenyaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResenyaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
