import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.0.10:5050/api';

  constructor(private http: HttpClient) { }

  login(email: string, senha: string) : Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`,
       { email, senha },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
  }

  setToken(token: string) : void {
    localStorage.setItem('token', token);
  }

  getToken() : string | null {
    return localStorage.getItem('token');
  }
}
