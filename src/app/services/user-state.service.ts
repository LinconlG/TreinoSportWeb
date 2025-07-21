// user-state.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private readonly _userType = signal<string | null>(null);

  // Expor como signal readonly
  public userType = this._userType.asReadonly();

  setUserType(type: string): void {
    this._userType.set(type);
  }

  getBaseHomePath(): string {
    const type = this._userType();
    if (!type) return '/home'; // Fallback padrão

    return `/home/${type.toLowerCase()}`;
  }

  getBaseLoginPath(): string {
    return '/login';
  }
}
