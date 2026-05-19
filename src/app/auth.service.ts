import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService) { }

  login(email: string, senha: string) : Observable<{ token: string }> {
    return this.api.post<{ token: string }>('login', { email, senha });
  }

  setToken(token: string) : void {
    localStorage.setItem('token', token);
  }

  getToken() : string | null {
    return localStorage.getItem('token');
  }
}
