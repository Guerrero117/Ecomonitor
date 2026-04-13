import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SensorsService } from '../../core/services/sensors';
import { GruposService } from '../../core/services/grupos.service';
import { LecturasService } from '../../core/services/lecturas.service';
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
  grupoId: string = '';

  nuevoSensor = { nombre: '', tipo: '', frecuencia: 10, unidad: '' };
  lectura = { sensorId: '', valor: null as number | null, unidad: '' };

  constructor(
    private sensorsService: SensorsService,
    private gruposService: GruposService,
    private lecturasService: LecturasService
  ) {}

  ngOnInit() {
    this.cargarBase();
  }

  cargarBase() {
    this.gruposService.getGrupos().subscribe(data => this.listaGrupos = data);
    this.sensorsService.getSensors().subscribe(data => {
      this.listaSensores = data;
      this.sensoresFiltrados = data;
    });
  }

  onGrupoChange() {
    const grupo = this.listaGrupos.find(g => (g.id || g._id) === this.grupoId);
    this.sensoresFiltrados = grupo 
      ? this.listaSensores.filter(s => grupo.sensoresIds.includes(s.id || s._id)) 
      : this.listaSensores;
  }

  actualizarUnidadNuevoSensor() {
    const t = this.nuevoSensor.tipo.toLowerCase();
    if (t.includes('temperatura')) this.nuevoSensor.unidad = '°C';
    else if (t.includes('humedad')) this.nuevoSensor.unidad = '%';
    else if (t.includes('luminosidad')) this.nuevoSensor.unidad = 'lux';
    else this.nuevoSensor.unidad = 'ppm';
  }

  registrarNuevoSensor() {
    this.sensorsService.createSensor(this.nuevoSensor).subscribe(() => {
      Swal.fire('¡Éxito!', 'Hardware registrado', 'success');
      this.cargarBase();
      this.nuevoSensor = { nombre: '', tipo: '', frecuencia: 10, unidad: '' };
    });
  }

  onSensorChange() {
    const sensor = this.listaSensores.find(s => (s.id || s._id) === this.lectura.sensorId);
    if (sensor) {
      this.lectura.unidad = sensor.tipo.toLowerCase().includes('temp') ? '°C' : 
                            sensor.tipo.toLowerCase().includes('hum') ? '%' : 'ppm';
    }
  }

  guardarDato() {
    this.lecturasService.enviarLecturaManual(this.lectura).subscribe(() => {
      Swal.fire('Guardado', 'Lectura manual registrada', 'success');
      this.lectura.valor = null;
    });
  }
}