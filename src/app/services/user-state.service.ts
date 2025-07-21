// user-state.service.ts
import { Injectable, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private readonly _userType = signal<string | null>(null);
  private jwtHelper = new JwtHelperService();

  constructor(private authService:AuthService){}

  // Expor como signal readonly
  public userType = this._userType.asReadonly();


  getTokenClaims(): any {
    const token = this.authService.getToken();
    if (!token) return null;

    try {
      var claims = this.jwtHelper.decodeToken(token);
      return this.jwtHelper.decodeToken(token);
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
