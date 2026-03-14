import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiKey = '4c5e44357f485e8d91406438b0b2dc4b'; 
  private city = 'Ciudad Obregon,MX';
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;

  constructor(private http: HttpClient) {}

  getClimaExterior(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}