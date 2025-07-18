import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ForgetPasswordRequest,
  forgetPasswordresponse,
  LoginRequest,
  OtpVerificationRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SimplifiedCountry,
} from '../components/Auth/models/auth.model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment.dev';
import * as CryptoJS from 'crypto-js';
import { ToDoListService } from '../Reposatories/to-do-list.repository.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl = environment.authUrl;

  //BehviorSubject
  private LoggedIn = new BehaviorSubject<boolean>(this.hastoken());
  isloggingIn$ = this.LoggedIn.asObservable();

  private secretKey = 'S3cr3t@Key!2025_#';

  constructor(private _http: HttpClient, private _todoRepo: ToDoListService) {}

  private hastoken(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, this.secretKey).toString();
  }

  decryptToken(encryptedToken: string): string | null {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedToken || null;
    } catch (error) {
      return null;
    }
  }

  // Register user

  register(data: RegisterRequest) {
    return this._todoRepo.register(data).pipe(catchError(this.handleError));
  }

  getCountries(): Observable<SimplifiedCountry[]> {
    return this._todoRepo.getCountries();
  }

  // Login user

  login(data: LoginRequest) {
    return this._todoRepo.login(data).pipe(
      map((res) => {
        const token = res.access_token;
        localStorage.setItem('access_token', token);
        this.LoggedIn.next(true);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Forget Password

  forgetPassword(data: ForgetPasswordRequest) {
    return this._todoRepo.forgetPassword(data);
  }

  // OTP Verification

  otp(data: OtpVerificationRequest) {
    return this._todoRepo.otp(data).pipe(catchError(this.handleError));
  }

  resetPassword(data: ResetPasswordRequest) {
    return this._todoRepo
      .resetPassword(data)
      .pipe(catchError(this.handleError));
  }

  logout() {
    return this._todoRepo.logout().pipe(
      map((response) => {
        localStorage.removeItem('access_token');
        this.LoggedIn.next(false);
        return response.data;
      }),
      catchError((error) => {
        localStorage.removeItem('access_token');
        this.LoggedIn.next(false);
        console.warn(
          'Server logout failed, but local logout completed:',
          error
        );
        return throwError(() => error);
      })
    );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => error);
  }
}
