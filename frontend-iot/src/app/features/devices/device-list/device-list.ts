import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './device-list.html',
  styleUrl: './device-list.css'
})
export class DeviceListComponent implements OnInit {
  
  // Revisa que el puerto (5126 o similar) sea el mismo que usa tu backend al correr
  private readonly API_URL = 'http://localhost:5126/api/sensors';

  devices: any[] = [];
  nuevoSensor = {
    nombre: '',
    tipo: 'Temperatura',
    frecuencia: 9
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarSensores();
  }

  cargarSensores() {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (res) => this.devices = res,
      error: (err) => console.error('Error al conectar con la API', err)
    });
  }

  guardarSensor() {
    if(!this.nuevoSensor.nombre) return alert("Ponle un nombre al sensor");

    this.http.post(this.API_URL, this.nuevoSensor).subscribe({
      next: () => {
        this.cargarSensores(); 
        this.nuevoSensor = { nombre: '', tipo: 'Temperatura', frecuencia: 9 };
      },
      error: (err) => console.error('Error al guardar', err)
    });
  }
}