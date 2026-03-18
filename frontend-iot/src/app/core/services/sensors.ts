import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorsService {
  private apiUrl = 'http://localhost:5126/api/sensors'; 

  constructor(private http: HttpClient) { }

  getSensors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSensorsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getSensorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}