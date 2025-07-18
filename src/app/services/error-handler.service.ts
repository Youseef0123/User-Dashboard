import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private router = inject(Router);

  constructor() {}

  handleError(error: any, fallbackMessage: string = 'Something went wrong!') {
    let message = fallbackMessage;
    let title = 'Error!';
    let icon: 'error' | 'warning' | 'info' = 'error';

    // Check for different types of error responses from backend
    if (error?.error) {
      // Handle new error format: { errors: [{ name: "field", message: "error message" }] }
      if (error.error.errors && Array.isArray(error.error.errors)) {
        // Just use the fallback message instead of showing detailed errors
        message = fallbackMessage;
        title = 'Error!';

        // Still check for email exists error for special handling
        const hasEmailExistsError = error.error.errors.some((err: any) =>
          err.name === 'email' &&
          (err.message.toLowerCase().includes('already') ||
           err.message.toLowerCase().includes('exists') ||
           err.message.toLowerCase().includes('taken'))
        );

        if (hasEmailExistsError) {
          title = 'Account Already Exists';
          message = 'An account with this email already exists.';
          icon = 'warning';
        }
      }
      // If there's a specific message from backend
      else if (error.error.message) {
        message = error.error.message;

        // Check for specific account exists message
        if (message.toLowerCase().includes('email') &&
            (message.toLowerCase().includes('already') ||
             message.toLowerCase().includes('exists') ||
             message.toLowerCase().includes('taken'))) {
          title = 'Account Already Exists';
          icon = 'warning';
        }
      }
      // If there are validation errors (422 status with errors object) - old format
      else if (error.error.errors && typeof error.error.errors === 'object') {
        const validationErrors = error.error.errors;
        const errorMessages = [];

        // Extract all validation error messages
        for (const field in validationErrors) {
          if (validationErrors[field] && Array.isArray(validationErrors[field])) {
            errorMessages.push(...validationErrors[field]);
          }
        }

        if (errorMessages.length > 0) {
          message = errorMessages.join('\n');
          title = 'Validation Error';

          // Check if any validation error is about email already existing
          const emailExistsError = errorMessages.some(msg =>
            msg.toLowerCase().includes('email') &&
            (msg.toLowerCase().includes('already') ||
             msg.toLowerCase().includes('exists') ||
             msg.toLowerCase().includes('taken'))
          );

          if (emailExistsError) {
            title = 'Account Already Exists';
            icon = 'warning';
          }
        }
      }
      // If error has a direct message property
      else if (typeof error.error === 'string') {
        message = error.error;
      }
    }
    // Handle HTTP status codes
    else if (typeof error === 'string') {
      message = error;
    } else if (error.status === 0) {
      message = 'Network error. Please check your connection.';
      title = 'Connection Error';
    } else if (error.status === 401) {
      message = 'Invalid credentials. Please check your email and password.';
      title = 'Authentication Error';
    } else if (error.status === 403) {
      message = 'Access forbidden. You don\'t have permission.';
      title = 'Permission Error';
    } else if (error.status === 404) {
      message = 'Resource not found.';
      title = 'Not Found';
    } else if (error.status === 422) {
      message = 'Invalid data provided. Please check your input.';
      title = 'Validation Error';
    } else if (error.status === 500) {
      message = 'Internal server error. Please try again later.';
      title = 'Server Error';
    }

    Swal.fire({
      icon: icon,
      title: title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#EB737A', // Use your app's color scheme
      showCancelButton: icon === 'warning' && title === 'Account Already Exists',
      cancelButtonText: icon === 'warning' && title === 'Account Already Exists' ? 'Go to Login' : undefined,
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      // If user clicks "Go to Login" when account exists
      if (result.dismiss === Swal.DismissReason.cancel &&
          title === 'Account Already Exists') {
        // You can inject Router here if needed, or emit an event
        window.location.href = '/login';
      }
    });
  }

  // Handle success messages
  handleSuccess(message: string, title: string = 'Success!') {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonText: 'Great!',
      confirmButtonColor: '#EB737A',
      timer: 3000,
      timerProgressBar: true
    });
  }

  // Handle account exists specifically with navigation
  handleAccountExists(message: string, router?: any) {
    Swal.fire({
      icon: 'warning',
      title: 'Account Already Exists',
      text: message || 'An account with this email already exists. Would you like to login instead?',
      confirmButtonText: 'Go to Login',
      confirmButtonColor: '#EB737A',
      showCancelButton: true,
      cancelButtonText: 'Try Again',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed && router) {
        router.navigate(['/login']);
      }
    });
  }

  // Handle validation errors with better formatting
  handleValidationErrors(errors: any[], fallbackMessage: string = 'Please check your input') {
    if (!errors || !Array.isArray(errors) || errors.length === 0) {
      this.handleError({ error: { message: fallbackMessage } }, fallbackMessage);
      return;
    }

    let htmlContent = '<div style="text-align: left;">';
    let hasEmailExistsError = false;

    errors.forEach((err: any) => {
      if (err.message && err.name) {
        // Format field name to be more user-friendly
        const fieldName = this.formatFieldName(err.name);
        htmlContent += `<p><strong>${fieldName}:</strong> ${err.message}</p>`;

        // Check for email already exists error
        if (err.name === 'email' &&
            (err.message.toLowerCase().includes('already') ||
             err.message.toLowerCase().includes('exists') ||
             err.message.toLowerCase().includes('taken'))) {
          hasEmailExistsError = true;
        }
      }
    });

    htmlContent += '</div>';

    if (hasEmailExistsError) {
      this.handleAccountExists('An account with this email already exists. Would you like to login instead?');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation Errors',
        html: htmlContent,
        confirmButtonText: 'OK',
        confirmButtonColor: '#EB737A',
        customClass: {
          htmlContainer: 'text-start'
        }
      });
    }
  }

  // Format field names to be more user-friendly
  private formatFieldName(fieldName: string): string {
    const fieldMap: { [key: string]: string } = {
      'first_name': 'First Name',
      'last_name': 'Last Name',
      'email': 'Email',
      'password': 'Password',
      'country_id': 'Country',
      'phone': 'Phone Number'
    };

    return fieldMap[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }






  handleLoginError(error: any) {
  let message = 'Invalid credentials. Please check your email and password.';
  let title = 'Login Failed';
  let icon: 'error' | 'warning' | 'info' = 'error';

  // Handle different login error scenarios
  if (error?.error) {
    // Handle new error format from backend
    if (error.error.errors && Array.isArray(error.error.errors)) {
      const loginError = error.error.errors.find((err: any) =>
        err.name === 'email' || err.name === 'password' || err.name === 'credentials'
      );

      if (loginError) {
        message = loginError.message;
      }
    }
    // Handle direct message from backend
    else if (error.error.message) {
      message = error.error.message;

      // Check for specific login error messages
      if (message.toLowerCase().includes('invalid credentials') ||
          message.toLowerCase().includes('incorrect password') ||
          message.toLowerCase().includes('user not found') ||
          message.toLowerCase().includes('email not found')) {
        title = 'Invalid Credentials';
        message = 'The email or password you entered is incorrect. Please try again.';
      }
      else if (message.toLowerCase().includes('account suspended') ||
               message.toLowerCase().includes('account disabled') ||
               message.toLowerCase().includes('account blocked')) {
        title = 'Account Suspended';
        message = 'Your account has been suspended. Please contact support.';
        icon = 'warning';
      }
      else if (message.toLowerCase().includes('email not verified') ||
               message.toLowerCase().includes('verify your email')) {
        title = 'Email Not Verified';
        message = 'Please verify your email before logging in.';
        icon = 'warning';
      }
    }
  }
  // Handle HTTP status codes specific to login
  else if (error.status === 401) {
    title = 'Invalid Credentials';
    message = 'The email or password you entered is incorrect. Please try again.';
  }
  else if (error.status === 403) {
    title = 'Account Suspended';
    message = 'Your account has been suspended. Please contact support.';
    icon = 'warning';
  }
  else if (error.status === 422) {
    title = 'Invalid Input';
    message = 'Please enter a valid email and password.';
  }
  else if (error.status === 0) {
    title = 'Connection Error';
    message = 'Unable to connect to server. Please check your internet connection.';
  }
  else if (error.status === 500) {
    title = 'Server Error';
    message = 'Something went wrong on our end. Please try again later.';
  }

  Swal.fire({
    icon: icon,
    title: title,
    text: message,
    confirmButtonText: 'Try Again',
    confirmButtonColor: '#EB737A',
    showCancelButton: title === 'Email Not Verified',
    cancelButtonText: title === 'Email Not Verified' ? 'Resend Verification' : undefined,
    cancelButtonColor: '#6c757d',
    customClass: {
      popup: 'login-error-popup',
      title: 'login-error-title'
    }
  }).then((result) => {
    // Handle "Resend Verification" action
    if (result.dismiss === Swal.DismissReason.cancel && title === 'Email Not Verified') {
      // Navigate to resend verification page or show resend form
      this.router.navigate(['/resend-verification']);
    }
  });
}

}
