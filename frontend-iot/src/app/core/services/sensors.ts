import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorsService {
  private apiUrl = 'http://localhost:5126/api/sensors'; 

  constructor(private http: HttpClient) { }

  // El backend filtrará automáticamente por el dueño del Token
  getSensors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSensorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createSensor(sensor: any): Observable<any> {
    return this.http.post(this.apiUrl, sensor);
  }

  deleteSensor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}