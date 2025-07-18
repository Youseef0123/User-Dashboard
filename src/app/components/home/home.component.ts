import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../components/Auth/models/user.model';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserFacadService } from '../../services/facadPattern/user-facad.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    PaginationComponent,
    NgbModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = new FormControl('');
  selectedUsers: string[] = [];
  allSelected: boolean = false;
  userToDelete: User | null = null;
  userToUpdate: User | null = null;
  editableUser: any = {};
  isEditMode: boolean = false;
  isChecked: boolean = false;
  // Sort variables
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  //Filter Variables
  selectedRole: string = '';
  selectedStatues: string = '';
  // modal varibles
  form!: FormGroup;
  private subscriptions: Subscription[] = [];

  //themes Variable
  @ViewChild('deleteModal') deleteModalRef: any;
  @ViewChild('editModal') editModalRef: any;

  // variables for pagination
  currentPage: number = 1;
  itemsPerPage: number = 10; // Number of users per page

  // Group and License options
  groupOptions: string[] = ['No Group', 'Administrators', 'Users', 'Managers'];
  licenseOptions: string[] = ['Free', 'Pro', 'Enterprise'];

  constructor(
    private _userFacadeService: UserFacadService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.loadUsers();

    const searchSub = this.searchTerm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.filterUsers(searchTerm || '');
        this.onPageChanged(1);
      });
    this.subscriptions.push(searchSub);
  }

  // filterUsers

  filterUsers(search: string) {
    if (!search) {
      this.filteredUsers = this.users;
    } else {
      const lower = search.toLowerCase();
      this.filteredUsers = this.users.filter(
        (user) =>
          user.name.toLocaleLowerCase().includes(lower) ||
          user.email.toLocaleLowerCase().includes(lower) ||
          user.role.toLocaleLowerCase().includes(lower)
      );
    }
  }

  // remove the user from the list

  openDeleteModal(user: User) {
    this.userToDelete = user;
    this.modalService.open(this.deleteModalRef);
  }

  ConfirmDelete() {
    if (!this.userToDelete) return;

    this._userFacadeService.deleteUserRequest(this.userToDelete.id).subscribe({
      next: () => {
        this.filteredUsers = this.filteredUsers.filter(
          (u) => +u.id !== +this.userToDelete!.id
        );
        this.modalService.dismissAll();
      },
    });
  }

  generateNewUserId(): string {
    const maxId = Math.max(...this.users.map((user) => parseInt(user.id) || 0));
    return (maxId + 1).toString();
  }
  // Update user information
  openEditModal(user: User) {
    this.isEditMode = true;
    this.userToUpdate = user;
    // data to push it in json file
    this.editableUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      Groups: user.Groups,
      'License Name': user['License Name'],
      Date: user.Date,
      img: user.img,
      selected: user.selected ?? false,
    };
    this.modalService.open(this.editModalRef, { size: 'lg', centered: true });

    if (!this.form) {
      this.form = this.fb.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        status: ['', Validators.required],
        licenseName: ['', Validators.required],
        Groups: ['', Validators.required],
      });
    }

    this.form.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      licenseName: user['License Name'],
      Groups: user.Groups,
    });

    // Setup real-time email validation
    this.setupEmailValidation();
  }

  // save edits or create new user
  saveEdit(modal: any) {
    if (!this.editableUser) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.editableUser = {
      ...this.editableUser,
      ...this.form.value,
      'License Name': this.form.value.licenseName,
    };

    // Check for email uniqueness before submitting
    const emailExists = this.users.some(
      (user) =>
        user.email === this.editableUser.email &&
        (!this.isEditMode || user.id !== this.userToUpdate?.id)
    );

    if (emailExists) {
      // Show email error
      this.form.get('email')?.setErrors({ emailExists: true });
      this.form.get('email')?.markAsTouched();
      return;
    }

    const validation = this.validateUserData(this.editableUser);
    if (!validation.isValid) {
      return;
    }

    if (this.isEditMode) {
      if (!this.userToUpdate) {
        return;
      }

      this._userFacadeService
        .updateUserRequest(this.userToUpdate.id, this.editableUser)
        .subscribe({
          next: (updatedUser: User) => {
            const filteredUserIndex = this.filteredUsers.findIndex(
              (u) => u.id === this.userToUpdate!.id
            );
            if (filteredUserIndex !== -1) {
              this.filteredUsers[filteredUserIndex] = updatedUser;
            }

            this.resetModalState(modal);
          },
          error: (error: any) => {
            this.handleApiError(error);
          },
        });
    } else {
      // Generate new ID before adding user
      const newId = this.generateNewUserId();
      this.editableUser.id = newId;

      this._userFacadeService.addUserRequest(this.editableUser).subscribe({
        next: (newUser: User) => {
          this.users.push(newUser);
          this.filteredUsers.push(newUser);
          this.resetModalState(modal);
        },
        error: (error: any) => {
          this.handleApiError(error);
        },
      });
    }
  }

  private resetModalState(modal: any) {
    modal.dismiss();
    this.userToUpdate = null;
    this.editableUser = {};
    this.isEditMode = false;
    this.refreshFilteredUsers();
  }

  refreshFilteredUsers() {
    const currentSearch = this.searchTerm.value || '';
    this.filterUsers(currentSearch);
  }

  // Real-time email validation
  setupEmailValidation() {
    const emailSub = this.form
      .get('email')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((email) => {
        if (email && this.form.get('email')?.valid) {
          this.checkEmailUniqueness(email);
        }
      });
    if (emailSub) {
      this.subscriptions.push(emailSub);
    }
  }

  // Check if email already exists
  checkEmailUniqueness(email: string) {
    const emailExists = this.users.some(
      (user) =>
        user.email === email &&
        (!this.isEditMode || user.id !== this.userToUpdate?.id)
    );

    if (emailExists) {
      this.form.get('email')?.setErrors({ emailExists: true });
    }
  }

  // Create new user
  openCreateModal() {
    this.isEditMode = false;
    this.userToUpdate = null;

    this.editableUser = {
      id: '',
      name: '',
      email: '',
      role: '',
      status: 'Active',
      Groups: 'No Group',
      'License Name': 'Free',
      Date: new Date().toLocaleDateString(),
      img: 'assets/images/default-avatar.svg',
      selected: false,
    };
    this.modalService.open(this.editModalRef, { size: 'lg', centered: true });

    // real time error
    this.form = this.fb.group({
      name: [
        this.editableUser.name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [this.editableUser.email, [Validators.required, Validators.email]],
      role: [this.editableUser.role, Validators.required],
      status: [this.editableUser.status, Validators.required],
      licenseName: [this.editableUser['License Name'], Validators.required],
      Groups: [this.editableUser.Groups, Validators.required],
    });

    // Setup real-time email validation
    this.setupEmailValidation();
  }

  loadUsers(): void {
    this._userFacadeService.GetUserRequest().subscribe((user: User[]) => {
      this.users = user;
      this.filteredUsers = user;
      this.isLoading = false;
    });
  }

  // Susbend Button

  onCheckboxChange(user: User, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    user.selected = isChecked;
    user.status = isChecked ? 'Suspended' : 'Active';

    this._userFacadeService.updateUserRequest(user.id, user).subscribe({
      next: (updatedUser: User) => {
        // Update the user in the main users array
        const userIndex = this.users.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
          this.users[userIndex] = updatedUser;
        }

        // Update the user in the filtered users array
        const filteredUserIndex = this.filteredUsers.findIndex(
          (u) => u.id === user.id
        );
        if (filteredUserIndex !== -1) {
          this.filteredUsers[filteredUserIndex] = updatedUser;
        }

        this.filterByRoleAndStatus();
      },
      error: (error: any) => {
        user.selected = !isChecked;
        user.status = !isChecked ? 'Suspended' : 'Active';
      },
    });
  }

  // sorting Function
  sortUser(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredUsers.sort((a, b) => {
      let valueA: any = a[column as keyof User];
      let valueB: any = b[column as keyof User];

      if (column === 'Date') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else {
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Filter User by Role and status

  filterByRoleAndStatus() {
    this.filteredUsers = this.users.filter((user) => {
      const matchesRole = this.selectedRole
        ? user.role === this.selectedRole
        : true;
      const matchesStatus = this.selectedStatues
        ? user.status === this.selectedStatues
        : true;

      this.onItemsPerPageChanged(10);

      return matchesRole && matchesStatus;
    });
  }

  // Pagination event handlers
  onPageChanged(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
  }

  validateUserData(userData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!userData.name || userData.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!userData.email || userData.email.trim() === '') {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!userData.role || userData.role.trim() === '') {
      errors.push('Role is required');
    }

    const existingUser = this.users.find(
      (user) => user.email === userData.email && user.id !== userData.id
    );
    if (existingUser) {
      errors.push('Email already exists');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  // Handle API errors
  handleApiError(error: any) {
    if (error.status === 400 && error.error?.message?.includes('email')) {
      this.form.get('email')?.setErrors({ emailExists: true });
      this.form.get('email')?.markAsTouched();
    }
    // Add more error handling as needed
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
