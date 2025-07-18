import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../components/Auth/dto/user.dto';
import { env } from 'process';
import { environment } from '../environments/environment.dev';
import { ToDoListService } from '../Reposatories/to-do-list.repository.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private UserUrl = environment.userUrl; // User API URL
  constructor(
    private http: HttpClient,
    private _ToDoListService: ToDoListService
  ) {}

  // Get all users
  getUsers(): Observable<UserResponseDto[]> {
    return this._ToDoListService.getUsers().pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  // Get single user by ID
  getUserById(id: string): Observable<UserResponseDto> {
    return this._ToDoListService.getUserById(id).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  // Add new user
  addUser(user: CreateUserDto): Observable<UserResponseDto> {
    return this._ToDoListService.addUser(user).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  // Update user
  updateUser(id: string, user: UpdateUserDto): Observable<UserResponseDto> {
    return this._ToDoListService.updateUser(id, user).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  // Delete user
  deleteUser(id: string): Observable<void> {
    return this._ToDoListService
      .deleteUser(id)
      .pipe(catchError(this.handleError));
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => error);
  }
}
