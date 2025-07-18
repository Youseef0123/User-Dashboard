import { AuthServiceService } from './../../services/auth-service.service';
import { Component, OnInit, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit ,OnDestroy{
  isMobileMenuOpen = false;
  isDarkMode = false;
  isScrolled = false;
  LoggedIn: boolean = false;
  isLogoutLoading: boolean = false;

    private themeSubscription!: Subscription;
    private loginStatusSubscription!: Subscription;


  constructor(private _AuthServiceService: AuthServiceService,
              private cdr: ChangeDetectorRef,
              private themeService: ThemeService,
              private router: Router
            ) {
  }


  ngOnInit(): void {
        // Subscribe to theme changes from service
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
      this.cdr.detectChanges();
    });


    // Subscribe to login status
    this.loginStatusSubscription = this._AuthServiceService.isloggingIn$.subscribe((status)=>{
      this.LoggedIn = status;
      this.cdr.detectChanges();
    });
  }

    ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.loginStatusSubscription) {
      this.loginStatusSubscription.unsubscribe();
    }
  }


  toggleTheme(): void {
    this.themeService.toggleTheme();
  }



  // CheckLoginStatus method removed, logic moved to ngOnInit


  // Logout user
  logout(): void {
    this.isLogoutLoading = true;
    this._AuthServiceService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        this.LoggedIn = false;
        this.router.navigate(['/login']);
        this.isLogoutLoading = false;
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.LoggedIn = false;
        this.router.navigate(['/login']);
        this.isLogoutLoading = false;
      }
    });
  }


  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }


  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }










}
