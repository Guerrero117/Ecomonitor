import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; 

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          // Limpiamos antes de guardar para evitar basura de sesiones anteriores
          localStorage.clear();
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.rol || 'user');
          localStorage.setItem('user_id', res.id.toString());
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  getRol(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rol') || 'user';
    }
    return 'user';
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}