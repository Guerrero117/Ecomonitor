import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private apiUrl = `${environment.apiUrl}/grupos`; 

  constructor(private http: HttpClient) { }

  getGrupos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para detectar qué Raspberries están activas
  getDetectados(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/mediciones/detectados`);
  }

  // Método para traer las lecturas en vivo de un grupo
  getLecturasGrupo(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/lecturas`);
  }

  crearGrupo(grupo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, grupo);
  }
}