import { TestBed } from '@angular/core/testing';

import { AuthFacadService } from './auth-facad.service';

describe('AuthFacadService', () => {
  let service: AuthFacadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthFacadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
