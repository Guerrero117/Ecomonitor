import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css'
})
export class AlertasComponent {
  
  // Datos de auditoría extraídos del dashboard original
  historialAlertas = [
    { fecha: '2026-03-01 08:30', evento: 'CO2 Elevado', zona: 'Oficina Principal', nivel: 'Crítico' },
    { fecha: '2026-02-28 14:15', evento: 'Batería Baja Sensor 04', zona: 'Invernadero Beta', nivel: 'Bajo' },
    { fecha: '2026-02-28 10:00', evento: 'Conexión Perdida Gateway', zona: 'Sistema', nivel: 'Medio' },
    { fecha: '2026-02-27 19:45', evento: 'Humedad Crítica', zona: 'Laboratorio', nivel: 'Crítico' }
  ];

  // Método para definir el color según el nivel
  getNivelClass(nivel: string) {
    return {
      'nivel-critico': nivel === 'Crítico',
      'nivel-medio': nivel === 'Medio',
      'nivel-bajo': nivel === 'Bajo'
    };
  }
}