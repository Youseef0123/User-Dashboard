import { inject, Injectable } from '@angular/core';
import { CreateUserDto } from '../../components/Auth/dto/user.dto';
import { UserService } from '../user.service';
import { BehaviorSubject, catchError, EMPTY, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserFacadService {
  // Injecting the UserService to use its methods
  private _userFacadeService = inject(UserService);

  //store user
  private _user = new BehaviorSubject<CreateUserDto[]>([]);
  user$ = this._user.asObservable();

  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  private _error = new BehaviorSubject<string>('');
  error$ = this._error.asObservable();

  private _FilterUser = new BehaviorSubject<CreateUserDto[]>([]);
  filterUser$ = this._FilterUser.asObservable();

  GetUserRequest(): any {
    this._loading.next(true);
    return this._userFacadeService.getUsers().pipe(
      tap((users: CreateUserDto[]) => {
        this._user.next(users);
        this._FilterUser.next(users);
        this._loading.next(false);
      }),
      catchError((error) => {
        this._error.next(error.message);
        this._loading.next(false);
        return EMPTY;
      })
    );
  }

  getUserById(id: string): any {
    return this._userFacadeService.getUserById(id);
  }

  addUserRequest(user: CreateUserDto): any {
    return this._userFacadeService.addUser(user).pipe(
      tap((newUser: CreateUserDto) => {
        const currentUsers = this._user.getValue();
        this._user.next([...currentUsers, newUser]);
      }),
      catchError((error) => {
        this._error.next(error.message);
        return EMPTY;
      })
    );
  }

  updateUserRequest(id: string, user: CreateUserDto): any {
    return this._userFacadeService.updateUser(id, user).pipe(
      tap((updatedUser: CreateUserDto) => {
        const currentUsers = this._user.getValue();
        const updatedUsers = currentUsers.map((u) =>
          (u as any).id === (updatedUser as any).id ? updatedUser : u
        );
        this._user.next(updatedUsers);
      }),
      catchError((error) => {
        this._error.next(error.message);
        return EMPTY;
      })
    );
  }

  deleteUserRequest(id: string): any {
    return this._userFacadeService.deleteUser(id).pipe(
      tap(() => {
        const currentUsers = this._user.getValue();
        const updatedUsers = currentUsers.filter((u) => (u as any).id !== id);
        this._user.next(updatedUsers);
      })
    );
  }
}
