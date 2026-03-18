import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  // He dejado el puerto 5126 que tenías en tu código
  private apiUrl = 'http://localhost:5126/api/grupos'; 

  constructor(private http: HttpClient) { }

  // Ahora recibe el userId para pedir solo sus grupos
  getGrupos(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  crearGrupo(grupo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, grupo);
  }
}