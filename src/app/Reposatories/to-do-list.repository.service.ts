import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  ForgetPasswordRequest,
  forgetPasswordresponse,
  LoginRequest,
  LoginResponse,
  OtpVerificationRequest,
  OtpVerificationResponse,
  RegisterRequest,
  RegisterResponse,
  SimplifiedCountry,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../components/Auth/models/auth.model';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../environments/environment.dev';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../components/Auth/dto/user.dto';
@Injectable({
  providedIn: 'root',
})
export class ToDoListService {
  private baseUrl = environment.authUrl;

  constructor(private _http: HttpClient) {}

  // Register user
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this._http.post<RegisterResponse>(
      `${this.baseUrl}user/auth/regular/register`,
      data
    );
  }

  //get countries
  getCountries(): Observable<SimplifiedCountry[]> {
    return this._http.get<SimplifiedCountry[]>(
      `${this.baseUrl}geography/allCountries`
    );
  }

  // Login user
  login(data: LoginRequest): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(
      `${this.baseUrl}user/auth/regular/login`,
      data
    );
  }

  // Forget Password
  forgetPassword(
    data: ForgetPasswordRequest
  ): Observable<forgetPasswordresponse> {
    return this._http.post<forgetPasswordresponse>(
      `${this.baseUrl}user/auth/forget-password/password/request`,
      data
    );
  }

  // OTP Verification
  otp(data: OtpVerificationRequest): Observable<OtpVerificationResponse> {
    return this._http.post<OtpVerificationResponse>(
      `${this.baseUrl}user/auth/forget-password/password/valdiate`,
      data
    );
  }

  // Reset Password
  resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this._http.post<ResetPasswordResponse>(
      `${this.baseUrl}user/auth/forget-password/password/reset`,
      data
    );
  }

  //logout
  logout(): Observable<any> {
    return this._http.post(`${this.baseUrl}user/auth/regular/logout`, {});
  }

  // user services

  private UserUrl = environment.userUrl; // User API URL

  getUsers(): Observable<UserResponseDto[]> {
    return this._http.get<UserResponseDto[]>(`${this.UserUrl}`);
  }

  getUserById(id: string): Observable<UserResponseDto> {
    return this._http.get<UserResponseDto>(`${this.UserUrl}/${id}`);
  }

  addUser(user: CreateUserDto): Observable<UserResponseDto> {
    return this._http.post<UserResponseDto>(`${this.UserUrl}`, user);
  }

  updateUser(id: string, user: UpdateUserDto): Observable<UserResponseDto> {
    return this._http.put<UserResponseDto>(`${this.UserUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this._http.delete<void>(`${this.UserUrl}/${id}`);
  }
}
