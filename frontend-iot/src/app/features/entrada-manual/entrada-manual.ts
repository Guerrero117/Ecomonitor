import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LecturasService } from '../../core/services/lecturas.service';
import { SensorsService } from '../../core/services/sensors';
import Swal from 'sweetalert2'; // Opcional: para alertas más pro

@Component({
  selector: 'app-entrada-manual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrada-manual.html',
  styleUrl: './entrada-manual.css'
})
export class EntradaManualComponent implements OnInit {
  listaSensores: any[] = [];
  ultimasLecturas: any[] = []; 
  
  // Configuraciones de magnitudes para sensores multivariables
  opcionesMultivariable = [
    { nombre: 'Dióxido de Carbono', clave: 'CO2', unidad: 'ppm' },
    { nombre: 'Dióxido de Nitrógeno', clave: 'NO2', unidad: 'µg/m³' },
    { nombre: 'Ozono', clave: 'O3', unidad: 'ppb' },
    { nombre: 'Partículas PM2.5', clave: 'PM2.5', unidad: 'µg/m³' }
  ];

  esMultivariable: boolean = false;

  lectura = {
    sensorId: '',
    tipoDato: '', // Ejemplo: 'CO2' o 'Temperatura'
    valor: null as number | null,
    unidad: '',
    esManual: true, // Marcador de seguridad OWASP para auditoría
    fecha: ''
  };

  constructor(
    private lecturasService: LecturasService,
    private sensorsService: SensorsService
  ) {}

  ngOnInit() {
    this.cargarSensores();
  }

  cargarSensores() {
    this.sensorsService.getSensors().subscribe({
      next: (data: any) => this.listaSensores = data,
      error: (err) => console.error("Error al cargar sensores", err)
    });
  }

  onSensorChange() {
    this.ultimasLecturas = [];
    if (!this.lectura.sensorId) return;

    const sensor = this.listaSensores.find(s => (s.id || s._id) === this.lectura.sensorId);
    
    if (sensor) {
      this.obtenerHistorial(this.lectura.sensorId);
      
      // LÓGICA DINÁMICA: ¿Es un sensor que mide varias cosas?
      const tipo = sensor.tipo.toLowerCase();
      if (tipo.includes('multi') || tipo.includes('aire') || tipo.includes('gas')) {
        this.esMultivariable = true;
        this.lectura.tipoDato = ''; // Reset para que el usuario elija
        this.lectura.unidad = '';
      } else {
        this.esMultivariable = false;
        this.lectura.tipoDato = sensor.tipo;
        this.asignarUnidadAutomatica(sensor.tipo);
      }
    }
  }

  // Se ejecuta si el sensor es multivariable y el usuario elige qué medir
  onMagnitudChange(event: any) {
    const seleccion = this.opcionesMultivariable.find(o => o.clave === event.target.value);
    if (seleccion) {
      this.lectura.tipoDato = seleccion.clave;
      this.lectura.unidad = seleccion.unidad;
    }
  }

  private asignarUnidadAutomatica(tipo: string) {
    const t = tipo.toLowerCase();
    if (t.includes('temp')) this.lectura.unidad = '°C';
    else if (t.includes('hum')) this.lectura.unidad = '%';
    else if (t.includes('co2')) this.lectura.unidad = 'ppm';
    else this.lectura.unidad = 'N/A';
  }

  obtenerHistorial(id: string) {
    this.lecturasService.getLecturasPorSensor(id).subscribe({
      next: (data: any) => this.ultimasLecturas = data.slice(0, 5), // Solo las últimas 5
      error: (err) => console.error("Error historial", err)
    });
  }

  guardarDato() {
    if (!this.lectura.sensorId || this.lectura.valor === null || !this.lectura.tipoDato) {
      Swal.fire('Atención', 'Faltan datos por completar', 'warning');
      return;
    }

    this.lectura.fecha = new Date().toISOString();

    this.lecturasService.enviarLecturaManual(this.lectura).subscribe({
      next: (res: any) => {
        Swal.fire('¡Éxito!', 'Dato registrado manualmente', 'success');
        this.obtenerHistorial(this.lectura.sensorId);
        this.lectura.valor = null;
      },
      error: (err: any) => {
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      }
    });
  }
}