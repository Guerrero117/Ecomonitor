import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorsService {
  private apiUrl = 'http://localhost:5126/api/sensors'; 

  constructor(private http: HttpClient) { }

  // Obtiene solo los sensores que pertenecen al usuario del Token
  getSensors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSensorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // El objeto 'sensor' ya viene validado desde el componente
  createSensor(sensor: any): Observable<any> {
    return this.http.post(this.apiUrl, sensor);
  }

  deleteSensor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}