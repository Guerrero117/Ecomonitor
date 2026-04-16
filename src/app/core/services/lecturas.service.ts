import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LecturasService {
  // Cambiado de localhost a la IP de la Raspberry
  private apiUrl = 'http://192.168.1.11:5126/api/lecturas'; 

  constructor(private http: HttpClient) { }

  enviarLecturaManual(lectura: any): Observable<any> {
    const payload = {
      ...lectura,
      esManual: true,
      origen: "Manual"
    };
    return this.http.post(this.apiUrl, payload);
  }

  getLecturasPorSensor(sensorId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sensor/${sensorId}`);
  }

  getLecturasPorGrupo(grupoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupo/${grupoId}`);
  }

  enviarBulk(lecturas: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/bulk`, lecturas);
  }
}