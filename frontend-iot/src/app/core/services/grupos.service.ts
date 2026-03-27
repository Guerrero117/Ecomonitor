import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GruposService {
  // 1. Asegúrate de usar este nombre en todo el archivo
  private apiUrl = `${environment.apiUrl}/grupos`; 

  constructor(private http: HttpClient) { }

  getGrupos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearGrupo(grupo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, grupo);
  }

  eliminarGrupo(id: string): Observable<any> {
    // 2. CORRECCIÓN: Cambiado 'this.url' por 'this.apiUrl'
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}