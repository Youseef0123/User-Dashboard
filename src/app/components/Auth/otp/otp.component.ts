import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthFacadService } from '../../../services/facadPattern/auth-facad.service';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent implements AfterViewInit {  @ViewChildren('otp0, otp1, otp2, otp3, otp4, otp5') otpInputs!: QueryList<ElementRef>;

  // Array to store OTP digits
  otpDigits: string[] = ['', '', '', '', '', ''];

  // Loading state
  isLoading: boolean = false;


  _authFacadeService =inject(AuthFacadService)
   router=inject(Router)


  ngAfterViewInit() {
    // Focus on first input when component loads
    if (this.otpInputs.first) {
      this.otpInputs.first.nativeElement.focus();
    }
  }


  verifyOtp(): void {
    const otpValue = this.getOtpValue();

    // Set loading state
    this.isLoading = true;

    // Get email from reset_data in localStorage
    const resetData = localStorage.getItem('reset_data');
    let email = '';

    if (resetData) {
      try {
        const parsedData = JSON.parse(resetData);
        email = parsedData.email;
      } catch (error) {
        this.isLoading = false;
        this.showErrorAlert('Failed to parse reset data');
        return;
      }
    } else {
      this.isLoading = false;
      this.showErrorAlert('No reset data found');
      return;
    }

    const data = {
      code: otpValue,
      email: email
    };

    this._authFacadeService.otp(data).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Show success alert
        this.showSuccessAlert().then(() => {
          localStorage.setItem('otpVerified', 'true');
          localStorage.setItem('otpCode', otpValue);
          this.router.navigate(['/reset-password']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        // Clear OTP inputs on error
        this.clearOtpInputs();

        // Show error alert based on error type
        if (error.status === 400 || error.status === 404) {
          this.showErrorAlert('Invalid OTP code. Please check and try again.');
        } else if (error.status === 410) {
          this.showErrorAlert('OTP code has expired. Please request a new one.');
        } else {
          this.showErrorAlert('Verification failed. Please try again.');
        }
      }
    });
  }


  // verifyOtp():void{
  //    if(this.isOtpComplete()){
  //     this._authFacadeService.
  //     sendOtpRequest(this.getOtpValue())
  //     ?.pipe(untilDestroyed(this))
  //     .subscribe();

  //    }
  // }


  onOtpChange(event: any, index: number) {
    const value = event.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      event.target.value = this.otpDigits[index];
      return;
    }

    this.otpDigits[index] = value;

    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    // Handle backspace to move to previous input
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      if (prevInput) {
        prevInput.nativeElement.focus();
        this.otpDigits[index - 1] = '';
      }
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Tab') {
      event.preventDefault();
    }

    if (event.key === 'Enter') {
      if (this.isOtpComplete() && !this.isLoading) {
        this.verifyOtp();
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6);

    // Fill the inputs with pasted numbers
    for (let i = 0; i < 6; i++) {
      this.otpDigits[i] = numbers[i] || '';
    }

    // Focus on the next empty input or last input
    const nextEmptyIndex = this.otpDigits.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);

    const targetInput = this.otpInputs.toArray()[focusIndex];
    if (targetInput) {
      targetInput.nativeElement.focus();
    }
  }

  // Get complete OTP as string
  getOtpValue(): string {
    return this.otpDigits.join('');
  }

  // Check if OTP is complete
  isOtpComplete(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }


  // Clear OTP inputs
  clearOtpInputs(): void {
    this.otpDigits = ['', '', '', '', '', ''];
    // Focus on first input
    setTimeout(() => {
      if (this.otpInputs.first) {
        this.otpInputs.first.nativeElement.focus();
      }
    }, 100);
  }

  // Show success alert
  showSuccessAlert(): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'OTP verified successfully',
      confirmButtonText: 'Continue',
      confirmButtonColor: '#28a745',
      timer: 2000,
      timerProgressBar: true
    });
  }

  // Show error alert
  showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Verification Failed',
      text: message,
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#dc3545',
      allowOutsideClick: false
    });
  }

  clearResetData(): void {
    localStorage.removeItem('reset_data');
    localStorage.removeItem('otpVerified');
  }



}
