import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guestGaurdGuard } from './guest-gaurd.guard';

describe('guestGaurdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guestGaurdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
