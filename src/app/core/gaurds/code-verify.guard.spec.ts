import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { codeVerifyGuard } from './code-verify.guard';

describe('codeVerifyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => codeVerifyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
