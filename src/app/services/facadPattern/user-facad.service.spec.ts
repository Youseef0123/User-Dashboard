import { TestBed } from '@angular/core/testing';

import { UserFacadService } from './user-facad.service';

describe('UserFacadService', () => {
  let service: UserFacadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFacadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
