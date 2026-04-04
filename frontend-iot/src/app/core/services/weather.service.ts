import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiKey = '4c5e44357f485e8d91406438b0b2dc4b'; 
  private city = 'Ciudad Obregon,MX';

  constructor(private http: HttpClient) {}

  getClimaExterior(): Observable<any> {
    // Usamos la ruta del proxy configurada en proxy.conf.json
    const url = `/weather-api/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;
    return this.http.get(url);
  }
}