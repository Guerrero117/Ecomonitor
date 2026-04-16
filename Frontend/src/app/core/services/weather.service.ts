import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiKey = '4c5e44357f485e8d91406438b0b2dc4b'; 
  private city = 'Ciudad Obregon,MX';
  private backendApi = 'http://localhost:5126/api/lecturas'; 

  constructor(private http: HttpClient) {}

  getClimaExterior(): Observable<any> {
    const url = `/weather-api/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;
    return this.http.get(url).pipe(
      tap(data => this.persistirClimaEnBaseDeDatos(data))
    );
  }

  private persistirClimaEnBaseDeDatos(data: any) {
    const lecturaHistorica = {
      sensorId: "VIRTUAL_OBREGON_STATION",
      valor: data.main.temp,
      unidad: "°C",
      origen: "OpenWeather",
      esManual: false,
      frecuenciaMinutos: 60 // Estimación de actualización de la API
    };

    this.http.post(this.backendApi, lecturaHistorica).subscribe({
      next: () => console.log("Historial de Obregón guardado"),
      error: (err) => console.error("No se pudo guardar el histórico de clima", err)
    });
  }
}