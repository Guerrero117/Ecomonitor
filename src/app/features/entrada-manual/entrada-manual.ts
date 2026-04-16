import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LecturasService } from '../../core/services/lecturas.service';
import { SensorsService } from '../../core/services/sensors';
import { GruposService } from '../../core/services/grupos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entrada-manual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrada-manual.html',
  styleUrl: './entrada-manual.css'
})
export class EntradaManualComponent implements OnInit {
  listaGrupos: any[] = [];
  listaSensores: any[] = [];
  sensoresFiltrados: any[] = [];
  ultimasLecturas: any[] = [];
  
  opcionesMultivariable = [
    { nombre: 'Dióxido de Carbono', clave: 'CO2', unidad: 'ppm' },
    { nombre: 'Dióxido de Nitrógeno', clave: 'NO2', unidad: 'µg/m³' },
    { nombre: 'Ozono', clave: 'O3', unidad: 'ppb' },
    { nombre: 'Partículas PM2.5', clave: 'PM2.5', unidad: 'µg/m³' }
  ];

  esMultivariable: boolean = false;
  grupoId: string = '';
  seleccionadosIds: string[] = [];

  // Límites estrictos para validación manual
  private readonly RANGOS: any = {
    temp: { min: -100, max: 150 },
    hum: { min: 0, max: 100 },
    co2: { min: 0, max: 5000 }, 
    default: { min: 0, max: 10000 }
  };

  rangoActual = { min: 0, max: 10000 };

  lectura = {
    sensorId: '',
    tipoDato: '',
    valor: null as number | null,
    unidad: '',
    frecuenciaMinutos: 15
  };

  constructor(
    private lecturasService: LecturasService,
    private sensorsService: SensorsService,
    private gruposService: GruposService
  ) {}

  ngOnInit() {
    this.gruposService.getGrupos().subscribe(data => this.listaGrupos = data);
    this.sensorsService.getSensors().subscribe(data => this.listaSensores = data);
  }

  onGrupoChange() {
    this.seleccionadosIds = [];
    const grupo = this.listaGrupos.find(g => (g.id || g._id) === this.grupoId);
    if (grupo) {
      this.sensoresFiltrados = this.listaSensores.filter(s => 
        grupo.sensoresIds.includes(s.id || s._id)
      );
    }
  }

  onSensorChange() {
    this.ultimasLecturas = [];
    if (!this.lectura.sensorId) return;

    const sensor = this.listaSensores.find(s => (s.id || s._id) === this.lectura.sensorId);
    if (sensor) {
      this.obtenerHistorial(this.lectura.sensorId);
      const tipo = sensor.tipo.toLowerCase();
      this.esMultivariable = (tipo.includes('multi') || tipo.includes('aire') || tipo.includes('gas'));
      this.lectura.tipoDato = this.esMultivariable ? '' : sensor.tipo;
      this.lectura.unidad = this.obtenerUnidadPorTipo(sensor.tipo);
      
      // Asignar rango de validación según el tipo
      if (tipo.includes('temp')) this.rangoActual = this.RANGOS.temp;
      else if (tipo.includes('hum')) this.rangoActual = this.RANGOS.hum;
      else if (tipo.includes('co2')) this.rangoActual = this.RANGOS.co2;
      else this.rangoActual = this.RANGOS.default;
    }
  }

  onMagnitudChange(event: any) {
    const seleccion = this.opcionesMultivariable.find(o => o.clave === event.target.value);
    if (seleccion) {
      this.lectura.tipoDato = seleccion.clave;
      this.lectura.unidad = seleccion.unidad;
    }
  }

  guardarDato() {
    if (this.lectura.valor === null) return;

    // Validación de rangos lógicos
    if (this.lectura.valor < this.rangoActual.min || this.lectura.valor > this.rangoActual.max) {
      Swal.fire('Valor fuera de rango', `Para este sensor el valor debe estar entre ${this.rangoActual.min} y ${this.rangoActual.max}`, 'error');
      return;
    }

    this.lecturasService.enviarLecturaManual(this.lectura).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Dato registrado correctamente', 'success');
        this.obtenerHistorial(this.lectura.sensorId);
        this.limpiarFormulario();
      }
    });
  }

  public obtenerUnidadPorTipo(tipo: string): string {
    const t = tipo.toLowerCase();
    if (t.includes('temp')) return '°C';
    if (t.includes('hum')) return '%';
    if (t.includes('aire') || t.includes('co2')) return 'ppm';
    if (t.includes('uv')) return 'uW/cm²';
    return 'lux';
  }

  private limpiarFormulario() {
    this.lectura.valor = null;
    this.lectura.sensorId = '';
    this.esMultivariable = false;
  }

  obtenerHistorial(id: string) {
    this.lecturasService.getLecturasPorSensor(id).subscribe(data => this.ultimasLecturas = data);
  }
}