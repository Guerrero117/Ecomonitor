import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorsService {
  // Asegúrate de que este puerto coincida con tu API de .NET
  private apiUrl = 'http://localhost:5126/api/sensors'; 

  constructor(private http: HttpClient) { }

  // Obtener todos los sensores de la base de datos
  getSensors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener un sensor específico por ID
  getSensorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}