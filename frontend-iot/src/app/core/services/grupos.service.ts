import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private apiUrl = 'http://localhost:5126/api/grupos'; 

  constructor(private http: HttpClient) { }

  // Ya no necesitamos el userId como parámetro.
  // El Backend lo extraerá del Token que envía el Interceptor.
  getGrupos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearGrupo(grupo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, grupo);
  }

  // Opcional: Para borrar un grupo si lo necesitas después
  borrarGrupo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}