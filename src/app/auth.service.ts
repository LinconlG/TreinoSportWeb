import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../environments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

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
