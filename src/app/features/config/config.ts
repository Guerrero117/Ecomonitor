import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config.html',
  styleUrl: './config.css'
})
export class ConfigComponent {
  // Datos del perfil basados en tu resumen
  usuario = {
    nombre: 'Octavio',
    rol: 'Administrador de Proyecto',
    equipo: 'Equipo Alan',
    proyecto: 'EcoMonitor IoT'
  };

  // Información técnica para auditoría (Arquitectura N-Capas)
  sistemaInfo = {
    backend: '.NET 8',
    database: 'MongoDB',
    status: 'Online',
    tokenValido: true
  };

  cerrarSesion() {
    console.log("Cerrando sesión segura...");
    // Aquí irá la lógica para limpiar el LocalStorage del JWT
  }
}