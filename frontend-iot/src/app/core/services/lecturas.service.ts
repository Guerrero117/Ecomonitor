import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LecturasService {
  // IP de la Raspberry Pi 4 configurada
  private apiUrl = 'http://192.168.1.11:5126/api/lecturas'; 

  constructor(private http: HttpClient) { }

  enviarLecturaManual(lectura: any): Observable<any> {
    const payload = {
      SensorId: lectura.sensorId,
      Valor: lectura.valor,
      Unidad: lectura.unidad,
      EsManual: true,
      Origen: "Manual"
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
    // Mantenemos el método bulk para cargas masivas
    return this.http.post(`${this.apiUrl}/bulk`, lecturas);
  }
}