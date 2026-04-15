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
  grupoSeleccionado: any = null;

  // Modelos de captura ajustados a tus requisitos
  capturaTemp = { sensorId: '', valor: null as number | null, unidad: '°C' };
  capturaHum = { sensorId: '', valor: null as number | null, unidad: '%' };
  capturaGas = { sensorId: '', valor: '' as string, unidad: 'Estado' }; // Buena/Mala
  capturaLux = { sensorId: '', valor: null as number | null, unidad: 'lm' }; // Lúmenes
  capturaLluvia = { sensorId: '', valor: '' as string, unidad: 'Detección' }; // Si/No

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
    this.sensorsService.getSensors().subscribe(data => this.listaSensores = data);
  }

  onGrupoChange() {
    const grupo = this.listaGrupos.find(g => (g.id || g._id) === this.grupoId);
    this.grupoSeleccionado = grupo || null;
    this.sensoresFiltrados = grupo ? this.listaSensores.filter(s => grupo.sensoresIds.includes(s.id || s._id)) : [];
    this.resetFormularios();
  }

  resetFormularios() {
    this.capturaTemp = { sensorId: '', valor: null, unidad: '°C' };
    this.capturaHum = { sensorId: '', valor: null, unidad: '%' };
    this.capturaGas = { sensorId: '', valor: '', unidad: 'Estado' };
    this.capturaLux = { sensorId: '', valor: null, unidad: 'lm' };
    this.capturaLluvia = { sensorId: '', valor: '', unidad: 'Detección' };
  }

  filtrarPorTipo(tipo: string): any[] {
    return this.sensoresFiltrados.filter(s => {
      const t = s.tipo.toLowerCase();
      switch(tipo) {
        case 'temp': return t.includes('temp') || t.includes('lm35');
        case 'hum': return t.includes('hum') || t.includes('dht');
        case 'aire': return t.includes('aire') || t.includes('mq');
        case 'lux': return t.includes('lum') || t.includes('ldr') || t.includes('lux');
        case 'lluvia': return t.includes('lluvia') || t.includes('rain');
        default: return false;
      }
    });
  }

  guardarDato(categoria: string) {
    const mapeo: any = {
      'temp': this.capturaTemp, 'hum': this.capturaHum,
      'aire': this.capturaGas, 'lux': this.capturaLux,
      'lluvia': this.capturaLluvia
    };
    const payload = mapeo[categoria];

    if (payload && payload.sensorId) {
      this.lecturasService.enviarLecturaManual(payload).subscribe(() => {
        Swal.fire({
          title: 'Registro Exitoso',
          text: `Se guardó el valor para ${categoria.toUpperCase()}`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false
        });
        // Resetear solo el valor después de guardar
        if (typeof payload.valor === 'string') payload.valor = '';
        else payload.valor = null;
      });
    }
  }
}