import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  // Reemplaza {API_KEY} con tu llave real
  private apiKey = '4c5e44357f485e8d91406438b0b2dc4b'; 
  private city = 'Ciudad Obregon,MX'; // O la ciudad de tu elección
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;

  constructor(private http: HttpClient) {}

  getClimaExterior() {
    return this.http.get(this.apiUrl);
  }
}