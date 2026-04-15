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
  
  // Lista de hardware con el nombre que pide tu HTML
  hardwareDisponible = [
    { pin: 18, modelo: 'MQ-135 / FC-22', tipo: 'Calidad Aire', unidad: 'ppm' },
    { pin: 27, modelo: 'LDR / Fotocelda', tipo: 'Luminosidad', unidad: 'lux' },
    { pin: 4,  modelo: 'DHT-11', tipo: 'Humedad', unidad: '%' },
    { pin: 17, modelo: 'LM35', tipo: 'Temperatura', unidad: '°C' }
  ];

  sensors: any[] = [];
  mostrarModal = false;
  cargando = false;
  sensorSeleccionado: any = null; // Variable crucial para el [(ngModel)] del select

  filterName: string = ''; 
  filterOption: string = 'todos'; 

  nuevoSensor = {
    Nombre: '', 
    Modelo: '', 
    Tipo: '', 
    Unidad: '',
    Frecuencia: 10,
    Pin: 0 
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
        if (this.filterOption === 'online') return s.estado === true;
        if (this.filterOption === 'offline') return s.estado === false;
        return true;
      });
    }
    return filtrados;
  }

  cargarSensores() {
    this.sensorsService.getSensors().subscribe({
      next: (res) => this.sensors = res,
      error: (err) => console.error('Error al obtener sensores:', err)
    });
  }

  // Función que el HTML llama con (change)
  vincularHardware() {
    if (this.sensorSeleccionado) {
      this.nuevoSensor.Modelo = this.sensorSeleccionado.modelo;
      this.nuevoSensor.Tipo = this.sensorSeleccionado.tipo;
      this.nuevoSensor.Unidad = this.sensorSeleccionado.unidad;
      this.nuevoSensor.Pin = this.sensorSeleccionado.pin;
    }
  }

  guardarSensor() {
    if (!this.nuevoSensor.Nombre || !this.sensorSeleccionado) {
       this.notificar('Atención', 'Selecciona el hardware y ponle un nombre.', 'warning');
       return;
    }
    this.cargando = true;
    this.sensorsService.createSensor(this.nuevoSensor).subscribe({
      next: () => {
        this.cargarSensores();
        this.cerrarModal();
        this.cargando = false;
        this.notificar('¡Éxito!', 'Hardware registrado correctamente.', 'success');
      },
      error: (err) => {
        this.cargando = false;
        this.notificar('Error', 'No se pudo guardar el dispositivo.', 'error');
      }
    });
  }

  borrarSensor(id: string) {
    this.sensorsService.deleteSensor(id).subscribe(() => this.cargarSensores());
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
    this.sensorSeleccionado = null;
    this.nuevoSensor = { Nombre: '', Modelo: '', Tipo: '', Unidad: '', Frecuencia: 10, Pin: 0 }; 
  }

  getOnlineCount() {
    return this.sensors.filter(s => s.estado).length;
  }

  private notificar(title: string, text: string, icon: any) {
    Swal.fire({ title, text, icon, background: '#1e293b', color: '#fff', confirmButtonColor: '#10b981' });
  }
}