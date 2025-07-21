import { Component, signal, effect } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserStateService } from '../../services/user-state.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-lateral-menu',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './lateral-menu.component.html',
  styleUrl: './lateral-menu.component.css'
})
export class LateralMenuComponent {
  homePath: string;
  loginPath: string;
  isMobile = signal(false);
  sidenavOpen = signal(false);

  constructor(
    private userState: UserStateService,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {
    this.homePath = this.userState.getBaseHomePath();
    this.loginPath = this.userState.getBaseLoginPath();

    // Observar mudanças de tamanho de tela
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
        this.isMobile.set(result.matches);
        this.sidenavOpen.set(!result.matches);
    });

    // Fechar menu ao navegar em mobile
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
        if (this.isMobile()) {
          this.sidenavOpen.set(false);
        }
    });

      // Reação a mudanças no userType
    effect(() => {
      this.homePath = this.userState.getBaseHomePath();
    });
  }

  toggleSidenav() {
    this.sidenavOpen.update(open => !open);
  }
}

