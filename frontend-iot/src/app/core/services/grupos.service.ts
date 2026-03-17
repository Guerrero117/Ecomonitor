import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  // Asegúrate de que el puerto 5126 sea el de tu .NET
  private apiUrl = 'http://localhost:5126/api/grupos'; 

  constructor(private http: HttpClient) { }

  getGrupos(filter?: { name: string; status: string; sensors: string; }): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);

  
}

  crearGrupo(grupo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, grupo);
  }

}