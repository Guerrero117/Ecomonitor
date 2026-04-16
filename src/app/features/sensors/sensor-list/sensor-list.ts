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
  
  dispositivosSoportados = [
    { modelo: 'MQ-135 / FC-22', tipo: 'Calidad Aire', unidad: 'ppm' },
    { modelo: 'LDR / Fotocelda', tipo: 'Luminosidad', unidad: 'lux' },
    { modelo: 'DHT-11', tipo: 'Humedad', unidad: '%' },
    { modelo: 'LM35', tipo: 'Temperatura', unidad: '°C' }
  ];

  sensors: any[] = [];
  mostrarModal = false;
  cargando = false;

  filterName: string = ''; 
  filterOption: string = 'todos'; 

  nuevoSensor = {
    Nombre: '', 
    Modelo: '', 
    Tipo: '', 
    Unidad: '',
    Frecuencia: 10
  };

  constructor(
    private sensorsService: SensorsService,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  get sensorsFiltrados() {
    let filtrados = this.sensors;
    if (this.filterName) {
      const search = this.filterName.toLowerCase().trim();
      filtrados = filtrados.filter(s => 
        s.nombre.toLowerCase().includes(search) || 
        s.tipo.toLowerCase().includes(search)
      );
    }
    if (this.filterOption !== 'todos') {
      filtrados = filtrados.filter(s => {
        switch (this.filterOption) {
          case 'online': return s.estado === true;
          case 'offline': return s.estado === false;
          case 'temp': return s.tipo.toLowerCase().includes('temperatura');
          case 'hum': return s.tipo.toLowerCase().includes('humedad');
          case 'aire': return s.tipo.toLowerCase().includes('aire');
          case 'fast': return s.frecuencia <= 5;
          default: return true;
        }
      });
    }
    return filtrados;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) { this.cargarSensores(); }
  }

  cargarSensores() {
    this.sensorsService.getSensors().subscribe({
      next: (res) => this.sensors = res,
      error: (err) => console.error('Error al obtener sensores:', err)
    });
  }

  actualizarDatosDesdeCatalogo() {
    const encontrado = this.dispositivosSoportados.find(d => d.modelo === this.nuevoSensor.Modelo);
    if (encontrado) {
      this.nuevoSensor.Tipo = encontrado.tipo;
      this.nuevoSensor.Unidad = encontrado.unidad;
    }
  }

  guardarSensor() {
    if (!this.nuevoSensor.Nombre || !this.nuevoSensor.Modelo) {
       Swal.fire({
         title: 'Atención',
         text: 'Completa el nombre y selecciona un modelo.',
         icon: 'warning',
         background: '#1e293b',
         color: '#fff'
       });
       return;
    }
    this.cargando = true;
    this.sensorsService.createSensor(this.nuevoSensor).subscribe({
      next: () => {
        this.cargarSensores();
        this.cerrarModal();
        this.cargando = false;
        Swal.fire({
          title: '¡Éxito!',
          text: 'Hardware registrado y asegurado.',
          icon: 'success',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      },
      error: (err) => {
        this.cargando = false;
        const msg = err.error?.mensaje || 'Error de comunicación con el servidor.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  borrarSensor(id: string) {
    Swal.fire({
      title: '¿Eliminar dispositivo?',
      text: "Se revocará el acceso al flujo de datos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, borrar',
      background: '#1e293b',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sensorsService.deleteSensor(id).subscribe(() => {
          this.cargarSensores();
          Swal.fire('Eliminado', 'Dispositivo desconectado.', 'success');
        });
      }
    });
  }

  getIcon(tipo: string) {
    const icons: any = { 
      'Temperatura': 'fas fa-thermometer-half', 
      'Humedad': 'fas fa-tint', 
      'Luminosidad': 'fas fa-lightbulb', 
      'Calidad Aire': 'fas fa-wind' 
    };
    return icons[tipo] || 'fas fa-microchip';
  }

  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { 
    this.mostrarModal = false; 
    this.nuevoSensor = { Nombre: '', Modelo: '', Tipo: '', Unidad: '', Frecuencia: 10 }; 
  }

  getOnlineCount() {
    return this.sensors.filter(s => s.estado).length;
  }
}