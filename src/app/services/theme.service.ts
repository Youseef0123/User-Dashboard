import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _theme = new BehaviorSubject<Theme>('light');
  theme$ = this._theme.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        this._theme.next(savedTheme);
      }
    }
    this.applyTheme();
  }

  get theme(): Theme {
    return this._theme.value;
  }

  get isDark(): boolean {
    return this._theme.value === 'dark';
  }

  toggleTheme(): void {
    const newTheme: Theme = this._theme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this._theme.next(theme);
    this.saveTheme(theme);
    this.applyTheme();
  }

  private saveTheme(theme: Theme): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  private applyTheme(): void {
    if (typeof document !== 'undefined') {
      const bodyElement = document.body;

      // Set data-theme attribute on body
      bodyElement.setAttribute('data-theme', this._theme.value);
    }
  }
}
