import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorsService {
  // Cambiado de localhost a la IP de la Raspberry
  private apiUrl = 'http://192.168.1.11:5126/api/sensors'; 

  constructor(private http: HttpClient) { }

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