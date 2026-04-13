import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GruposService } from '../../core/services/grupos.service';
import { SensorsService } from '../../core/services/sensors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './grupos.html',
  styleUrl: './grupos.css'
})
export class GruposComponent implements OnInit {
  misGrupos: any[] = [];
  dispositivosDisponibles: any[] = [];
  mostrarModal = false;
  mostrarModalDetalles = false;
  nuevoGrupoNombre = '';
  grupoSeleccionado: any = null;
  filters = { name: '', status: '' };

  constructor(
    private gruposService: GruposService, 
    private sensorsService: SensorsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get misGruposFiltrados() {
    return this.misGrupos.filter(g => {
      const matchName = g.nombre.toLowerCase().includes(this.filters.name.toLowerCase());
      return matchName;
    });
  }

  ngOnInit() { if (isPlatformBrowser(this.platformId)) { this.cargarDatos(); } }

  cargarDatos() {
    this.gruposService.getGrupos().subscribe(data => this.misGrupos = data);
    this.sensorsService.getSensors().subscribe(data => {
      this.dispositivosDisponibles = data.map((s: any) => ({ ...s, seleccionado: false }));
    });
  }

  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { this.mostrarModal = false; this.nuevoGrupoNombre = ''; }

  verDetalles(grupo: any) {
    this.grupoSeleccionado = { ...grupo };
    this.mostrarModalDetalles = true;
  }

  cerrarModalDetalles() { this.mostrarModalDetalles = false; this.grupoSeleccionado = null; }

  guardarGrupo() {
    if (!this.nuevoGrupoNombre.trim()) return;
    const seleccionados = this.dispositivosDisponibles.filter(d => d.seleccionado).map(d => d.id || d._id);
    this.gruposService.crearGrupo({ nombre: this.nuevoGrupoNombre, sensoresIds: seleccionados, estado: 'Activo' }).subscribe(() => {
      this.cargarDatos();
      this.cerrarModal();
    });
  }
}