import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment'; // Importamos el environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usamos la URL del environment para que cambie según el entorno
  private apiUrl = `${environment.apiUrl}/auth`; 

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        // Almacenamiento seguro de datos de sesión
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.rol);
          localStorage.setItem('user_id', res.id);
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  getRol(): string {
    return typeof window !== 'undefined' ? localStorage.getItem('rol') || 'user' : 'user';
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;
  }

  logout() {
    localStorage.clear();
    // Navegación limpia al logout
    window.location.href = '/login';
  }
}