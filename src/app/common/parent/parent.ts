import { Component, signal, model, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-parent',
  imports: [DrawerModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './parent.html',
  styles: ``,
})
export class Parent implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private resizeListener?: () => void;

  // Theme service
  themeService = inject(ThemeService);

  // Responsive breakpoint: mobile < 768px
  isMobile = signal(false);
  drawerVisible = model(false);

  routes = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'inventory_2', label: 'My Bar', route: '/my-bar' },
    { icon: 'explore', label: 'Browse', route: '/browse' },
    { icon: 'favorite', label: 'Favourite', route: '/favourite' },
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize state
      const initialMobile = window.innerWidth < MOBILE_BREAKPOINT;
      this.isMobile.set(initialMobile);
      this.drawerVisible.set(!initialMobile);

      // Listen to window resize events
      this.resizeListener = () => this.updateMobileState();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private updateMobileState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const wasMobile = this.isMobile();
    const isNowMobile = window.innerWidth < MOBILE_BREAKPOINT;

    this.isMobile.set(isNowMobile);

    // Auto-manage drawer state on breakpoint change
    if (wasMobile !== isNowMobile) {
      this.drawerVisible.set(!isNowMobile);
    }
  }

  toggleDrawer(): void {
    this.drawerVisible.update(v => !v);
  }

  closeDrawerOnMobile(): void {
    if (this.isMobile()) {
      this.drawerVisible.set(false);
    }
  }
}
