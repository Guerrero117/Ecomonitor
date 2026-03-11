import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sensor-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './sensor-list.html',
  styleUrl: './sensor-list.css'
})
export class SensorListComponent implements OnInit {
  // Aquí guardaremos los sensores que vienen de la nube
  dispositivos: any[] = [];
  apiUrl = 'http://localhost:5126/api/sensors'; // Revisa que este sea tu puerto de .NET

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerSensores();
  }

  // Jalar datos de MongoDB Atlas a través del Backend
  obtenerSensores() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.dispositivos = data;
        console.log('Sensores cargados:', data);
      },
      error: (err) => console.error('Error al conectar con la API:', err)
    });
  }

  // Borrar un sensor por su ID de Mongo
  eliminar(id: string) {
    if (confirm('¿Seguro que quieres eliminar este dispositivo de la nube?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          // Filtramos la lista local para que desaparezca de inmediato
          this.dispositivos = this.dispositivos.filter(s => s.id !== id);
          alert('Sensor eliminado con éxito');
        },
        error: (err) => alert('No se pudo eliminar el sensor')
      });
    }
  }
}