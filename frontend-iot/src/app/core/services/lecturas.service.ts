import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LecturasService {
  private apiUrl = 'http://localhost:5126/api/lecturas'; 

  constructor(private http: HttpClient) { }

  enviarLecturaManual(lectura: any): Observable<any> {
    return this.http.post(this.apiUrl, lectura);
  }

  getLecturasPorSensor(sensorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${sensorId}`);
  }
}