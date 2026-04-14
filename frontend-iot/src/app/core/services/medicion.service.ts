import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicion } from '../models/medicion.model';

@Injectable({
  providedIn: 'root'
})
export class MedicionService {
  private apiUrl = 'http://192.168.100.1:4200/api/Mediciones';

  constructor(private http: HttpClient) { }

  getMediciones(): Observable<Medicion[]> {
    return this.http.get<Medicion[]>(this.apiUrl);
  }
}