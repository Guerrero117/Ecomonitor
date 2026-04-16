import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GruposService } from '../../core/services/grupos.service';
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
  filters = { name: '', status: '' };
  mostrarModal = false;
  nuevoGrupoNombre = '';
  
  // Variables que el HTML estaba buscando
  mostrarDetalle = false;
  grupoSeleccionado: any = null;
  lecturasVivas: any[] = [];

  constructor(
    private gruposService: GruposService, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get misGruposFiltrados() {
    return this.misGrupos.filter(g => {
      const matchName = g.nombre.toLowerCase().includes(this.filters.name.toLowerCase());
      const sensorCount = g.sensoresIds?.length || 0;
      if (this.filters.status === 'active') return matchName && g.estado === 'Activo';
      if (this.filters.status === 'empty') return matchName && sensorCount === 0;
      return matchName;
    });
  }

  ngOnInit() { 
    if (isPlatformBrowser(this.platformId)) { this.cargarDatos(); }
  }

  cargarDatos() {
    this.gruposService.getGrupos().subscribe({
      next: (data: any[]) => this.misGrupos = data,
      error: (err: any) => console.error(err)
    });

    this.gruposService.getDetectados().subscribe({
      next: (ids: string[]) => {
        this.dispositivosDisponibles = ids.map(id => ({ id, seleccionado: false }));
      },
      error: (err: any) => console.error(err)
    });
  }

  verDetalle(grupo: any) {
    this.grupoSeleccionado = grupo;
    const id = grupo.id || grupo._id;
    this.gruposService.getLecturasGrupo(id).subscribe({
      next: (data: any[]) => {
        this.lecturasVivas = data;
        this.mostrarDetalle = true;
      },
      error: (err: any) => Swal.fire('Error', 'No hay datos vivos', 'error')
    });
  }

  guardarGrupo() {
    if (!this.nuevoGrupoNombre.trim()) return;
    const seleccionados = this.dispositivosDisponibles.filter(d => d.seleccionado).map(d => d.id);
    this.gruposService.crearGrupo({ nombre: this.nuevoGrupoNombre, sensoresIds: seleccionados, estado: 'Activo' }).subscribe({
      next: () => {
        this.cargarDatos();
        this.cerrarModal();
      }
    });
  }

  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { 
    this.mostrarModal = false; 
    this.mostrarDetalle = false;
    this.nuevoGrupoNombre = '';
  }
}