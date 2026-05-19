// user-state.service.ts
// TODO: run "npm uninstall @auth0/angular-jwt" after verifying
import { Injectable, signal } from '@angular/core';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private readonly _userType = signal<string | null>(null);

  constructor(private authService:AuthService){}

  // Expor como signal readonly
  public userType = this._userType.asReadonly();

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getTokenClaims(): any {
    const token = this.authService.getToken();
    if (!token) return null;

    try {
      return this.decodeToken(token);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getUserType(): string | null {
    const claims = this.getTokenClaims();
    if (claims.role) {
      return claims.role as string;
    }

    return null;
  }

  setUserType(): void {
    var type = this.getUserType();
    this._userType.set(type);
  }

  getBaseHomePath(): string {
    if (!this.userType()){
      this.setUserType();
    }

    return `/home/${this.userType().toLowerCase()}`;
  }

  getBaseLoginPath(): string {
    return '/login';
  }
}

