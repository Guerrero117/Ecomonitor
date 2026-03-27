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
  
  // 1. Catálogo oficial (El usuario elige de aquí)
  dispositivosSoportados = [
    { modelo: 'MQ-135 / FC-22', tipo: 'Calidad Aire', unidad: 'ppm' },
    { modelo: 'LDR / Fotocelda', tipo: 'Luminosidad', unidad: 'lux' },
    { modelo: 'DHT-11', tipo: 'Humedad', unidad: '%' },
    { modelo: 'LM35', tipo: 'Temperatura', unidad: '°C' }
  ];

  sensors: any[] = [];
  mostrarModal = false;
  cargando = false;

  // 2. Estructura que se enviará a MongoDB
  nuevoSensor = {
    nombre: '', 
    modelo: '', 
    tipo: '', 
    unidad: '',
    frecuencia: 10
  };

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
      error: (err) => console.error('Error al obtener sensores:', err)
    });
  }

  // 3. Al elegir en el select del HTML, se autocompleta el resto
  actualizarDatosDesdeCatalogo() {
    const encontrado = this.dispositivosSoportados.find(d => d.modelo === this.nuevoSensor.modelo);
    if (encontrado) {
      this.nuevoSensor.tipo = encontrado.tipo;
      this.nuevoSensor.unidad = encontrado.unidad;
    }
  }

  guardarSensor() {
    if (!this.nuevoSensor.nombre || !this.nuevoSensor.modelo) {
       Swal.fire('Atención', 'Ponle un nombre y elige qué sensor es.', 'warning');
       return;
    }

    this.cargando = true;
    this.sensorsService.createSensor(this.nuevoSensor).subscribe({
      next: () => {
        this.cargarSensores();
        this.cerrarModal();
        this.cargando = false;
        Swal.fire('¡Éxito!', `El sensor ${this.nuevoSensor.modelo} se registró correctamente.`, 'success');
      },
      error: (err) => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudo guardar en la base de datos.', 'error');
      }
    });
  }

  borrarSensor(id: string) {
    Swal.fire({
      title: '¿Eliminar dispositivo?',
      text: "Esto no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sensorsService.deleteSensor(id).subscribe(() => {
          this.cargarSensores();
          Swal.fire('Eliminado', 'El sensor ya no existe.', 'success');
        });
      }
    });
  }

  // Devuelve el icono según el tipo para la tabla/lista
  getIcon(tipo: string) {
    const icons: any = { 
      'Temperatura': 'fas fa-thermometer-half', 
      'Humedad': 'fas fa-tint', 
      'Luminosidad': 'fas fa-lightbulb', 
      'Calidad Aire': 'fas fa-wind' 
    };
    return icons[tipo] || 'fas fa-microchip';
  }

  abrirModal() { 
    this.mostrarModal = true; 
  }

  cerrarModal() { 
    this.mostrarModal = false; 
    this.nuevoSensor = { nombre: '', modelo: '', tipo: '', unidad: '', frecuencia: 10 }; 
  }
}