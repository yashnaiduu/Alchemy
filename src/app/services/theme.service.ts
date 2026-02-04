import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'spirit-shelf-theme';

  // Signal to track dark mode state
  isDarkMode = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load theme preference from localStorage or system preference
      this.initializeTheme();

      // Effect to apply theme changes
      effect(() => {
        const darkMode = this.isDarkMode();
        this.applyTheme(darkMode);
      });
    }
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);

    if (savedTheme !== null) {
      // Use saved preference
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
  }

  private applyTheme(darkMode: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;

      if (darkMode) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }

      // Save preference
      localStorage.setItem(this.STORAGE_KEY, darkMode ? 'dark' : 'light');
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
  }
}
