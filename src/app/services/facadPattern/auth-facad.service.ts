import { inject, Injectable } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import {
  RegisterRequest,
  LoginRequest,
  ForgetPasswordRequest,
  OtpVerificationRequest,
  ResetPasswordRequest,
  SimplifiedCountry,
} from '../../components/Auth/models/auth.model';
import { TokenService } from '../token.service';
import { BehaviorSubject, catchError, EMPTY, finalize, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class AuthFacadService {
  // store for forget Password
  private _forgetPasswordLoading = new BehaviorSubject<boolean>(false);
  forgetPasswordLoading = this._forgetPasswordLoading.asObservable();

  private _forgetPasswordError = new BehaviorSubject<any>(null);
  forgetPasswordError = this._forgetPasswordError.asObservable();

  private _forgetPasswordResponse = new BehaviorSubject<any>(null);
  forgetPasswordResponse = this._forgetPasswordError.asObservable();

  // store for otp
  private _OtpLoading = new BehaviorSubject<boolean>(false);
  OtpLoading = this._OtpLoading.asObservable();

  private _otpError = new BehaviorSubject<any>(null);
  otpError = this._otpError.asObservable();

  private _otpResponse = new BehaviorSubject<any>(null);
  otpResponse = this._otpResponse.asObservable();

  //store for Reset Password
  private _resetPasswordLoading = new BehaviorSubject(false);
  resetPasswordLoading = this._resetPasswordLoading.asObservable();

  private _resetPasswordError = new BehaviorSubject<any>(null);
  resetPasswordError = this._resetPasswordError.asObservable();

  private _resetPasswordResponse = new BehaviorSubject<any>(null);
  resetPasswordResponse = this._resetPasswordResponse.asObservable();

  //store for login
  private _loginLoading = new BehaviorSubject<boolean>(false);
  loginLoading = this._loginLoading.asObservable();

  private _loginError = new BehaviorSubject<any>(null);
  loginError = this._loginError.asObservable();

  private _loginResponse = new BehaviorSubject<any>(null);
  loginResponse = this._loginResponse.asObservable();

  // store for register
  private _registerLoading = new BehaviorSubject<boolean>(false);
  registerLoading = this._registerLoading.asObservable();

  private _registerError = new BehaviorSubject<any>(null);
  registerError = this._registerError.asObservable();

  private _registerResponse = new BehaviorSubject<any>(null);
  registerResponse = this._registerResponse.asObservable();

  // store for countries
  private _countries = new BehaviorSubject<SimplifiedCountry[]>([]);
  countries = this._countries.asObservable();

  _authService = inject(AuthServiceService);
  _token = inject(TokenService);
  _router = inject(Router);

  sendRegisterRequest(data: RegisterRequest) {
    this._registerLoading.next(true);

    return this._authService.register(data).pipe(
      tap((resp) => {
        this._registerLoading.next(false);

        this._registerResponse.next(resp);
        this._router.navigate(['/login']);
      }),
      catchError((err) => {
        this._registerError.next(err);
        return EMPTY;
      })
    );
  }

  sendLoginRequst(data: LoginRequest) {
    this._loginLoading.next(true);

    return this._authService.login(data).pipe(
      tap((resp) => {
        const encryptedToken = this.encryptToken(resp.access_token);
        localStorage.setItem('access_token', encryptedToken);
        this._loginResponse.next(resp);
        this._loginLoading.next(false);
        this._router.navigate(['/home']);
      }),
      catchError((err) => {
        this._loginError.next(err);
        this._loginLoading.next(false);
        return EMPTY;
      }),

      finalize(() => this._loginLoading.next(false))
    );
  }

  GetCountries() {
    return this._authService.getCountries();
  }

  // forget Password

  sendForgetPasswordRequest(email: string) {
    this._forgetPasswordLoading.next(true);
    const data = { email };
    return this._authService.forgetPassword(data).pipe(
      tap((resp) => {
        this._forgetPasswordResponse.next(resp);
        localStorage.setItem('reset_data', JSON.stringify({ email }));
        this._router.navigate(['/otp']);
      }),
      catchError((err) => {
        this._forgetPasswordError.next(err);
        return EMPTY;
      }),
      finalize(() => this._forgetPasswordLoading.next(false))
    );
  }

  // sendOtpRequest(code:string) {
  //   this._OtpLoading.next(true);
  //   const resetData = localStorage.getItem('reset_data');
  //   let email = '';
  //   const data: OtpVerificationRequest = {
  //       code: code,
  //       email: email,
  //     };

  //   if (resetData) {
  //     try {
  //       const parsedData = JSON.parse(resetData);
  //       email = parsedData.email;
  //     } catch (error) {
  //       this._OtpLoading.next(false);
  //       this._otpError.next({ message: 'No reset data found' });
  //       return EMPTY;
  //     }

  //     return this._authService.otp(data).pipe(
  //       tap((resp) => {
  //         this._otpResponse.next(resp);
  //         localStorage.setItem('otpVerified', 'true');
  //         localStorage.setItem('otpCode', code);
  //         this._router.navigate(['/reset-password']);
  //       }),
  //       catchError((err) => {
  //         this._otpError.next(err);
  //         return EMPTY;
  //       }),
  //       finalize(() => this._OtpLoading.next(false))
  //     );
  //   }

  //   return this._authService.otp(data).pipe(tap((resp) => {}));
  // }

  otp(data: OtpVerificationRequest) {
    return this._authService.otp(data);
  }

  resetPasswordRequest(Pass: string) {
    this._resetPasswordLoading.next(true);
    const otpCode = localStorage.getItem('otpCode') || '';
    const email = localStorage.getItem('reset_data');
    const newPassword = Pass || '';

    const data: ResetPasswordRequest = {
      email: email ? JSON.parse(email).email : '',
      password: newPassword,
      code: otpCode,
    };

    return this._authService.resetPassword(data).pipe(
      tap((resp) => {
        this._resetPasswordLoading.next(false);
        this._resetPasswordResponse.next(resp);
        localStorage.removeItem('reset_data');
        localStorage.removeItem('otpVerified');
        localStorage.removeItem('otpCode');
        this._router.navigate(['/login']);
      }),
      catchError((err) => {
        this._resetPasswordError.next(err);
        return EMPTY;
      }),
      finalize(() => this._resetPasswordLoading.next(false))
    );
  }

  logout() {
    return this._authService.logout();
  }

  encryptToken(token: string): string {
    return this._authService.encryptToken(token);
  }

  decryptToken(encryptedToken: string): string | null {
    return this._authService.decryptToken(encryptedToken);
  }

  // the token service methods

  saveToken(token: string): void {
    this._token.savToken(token);
  }

  GetHashedToken(): string | null {
    return this._token.getHashedToken();
  }

  IsTokenMatch(tokenToCompare: string): boolean {
    return this._token.isTokenMatch(tokenToCompare);
  }

  clearToken(): void {
    this._token.clearToken();
  }
}
