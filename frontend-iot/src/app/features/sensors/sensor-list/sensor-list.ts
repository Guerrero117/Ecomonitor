import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SensorsService } from '../../../core/services/sensors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sensor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sensor-list.html',
  styleUrl: './sensor-list.css'
})
export class SensorListComponent implements OnInit {
  sensors: any[] = [];
  mostrarModal = false;
  cargando = false;
  nuevoSensor = { nombre: '', tipo: 'Temperatura', frecuencia: 10 };

  constructor(
    private sensorsService: SensorsService,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarSensores();
    }
  }

  cargarSensores() {
    this.sensorsService.getSensors().subscribe({
      next: (res) => this.sensors = res,
      error: (err) => console.error('Error de seguridad o conexión:', err)
    });
  }

  guardarSensor() {
    this.cargando = true;
    this.sensorsService.createSensor(this.nuevoSensor).subscribe({
      next: () => {
        this.cargarSensores();
        this.cerrarModal();
        this.cargando = false;
        Swal.fire('Éxito', 'Sensor guardado y protegido', 'success');
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No tienes permiso o hubo un fallo', 'error');
      }
    });
  }

  borrarSensor(id: string) {
    Swal.fire({
      title: '¿Eliminar dispositivo?',
      text: "Se borrará permanentemente de tu cuenta",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sensorsService.deleteSensor(id).subscribe({
          next: () => {
            this.cargarSensores();
            Swal.fire('Eliminado', 'Dispositivo removido', 'success');
          }
        });
      }
    });
  }

  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { 
    this.mostrarModal = false; 
    this.nuevoSensor = { nombre: '', tipo: 'Temperatura', frecuencia: 10 }; 
  }

  getIcon(tipo: string) {
    const icons: any = { 
      'Temperatura': 'fas fa-thermometer-half', 
      'Humedad': 'fas fa-tint', 
      'Radiación UV': 'fas fa-sun', 
      'CO2': 'fas fa-cloud' 
    };
    return icons[tipo] || 'fas fa-microchip';
  }
}