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
  nuevoGrupoNombre = '';
  filters = { name: '', status: '' };

  constructor(
    private gruposService: GruposService, 
    private sensorsService: SensorsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get misGruposFiltrados() {
    return this.misGrupos.filter(g => 
      g.nombre.toLowerCase().includes(this.filters.name.toLowerCase())
    );
  }

  ngOnInit() { 
    if (isPlatformBrowser(this.platformId)) { this.cargarDatos(); }
  }

  cargarDatos() {
    this.gruposService.getGrupos().subscribe({
      next: (data: any[]) => this.misGrupos = data,
      error: (err) => console.error("Error al cargar grupos", err)
    });

    this.sensorsService.getSensors().subscribe({
      next: (data: any[]) => {
        this.dispositivosDisponibles = data.map((s: any) => ({
          ...s,
          seleccionado: false
        }));
      }
    });
  }

  guardarGrupo() {
    if (!this.nuevoGrupoNombre.trim()) {
      Swal.fire('Error', 'El nombre del grupo es obligatorio', 'error');
      return;
    }

    const seleccionados = this.dispositivosDisponibles
      .filter(d => d.seleccionado)
      .map(d => d.id || d._id);

    const nuevoGrupo = {
      nombre: this.nuevoGrupoNombre,
      sensoresIds: seleccionados, 
      estado: 'Activo'
    };

    this.gruposService.crearGrupo(nuevoGrupo).subscribe({
      next: (res) => {
        Swal.fire('¡Éxito!', 'Grupo creado correctamente', 'success');
        this.cargarDatos();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        Swal.fire('Error', 'El servidor rechazó la creación del grupo', 'error');
      }
    });
  }

  abrirModal() { this.mostrarModal = true; }
  
  cerrarModal() { 
    this.mostrarModal = false; 
    this.nuevoGrupoNombre = ''; 
    this.dispositivosDisponibles.forEach(d => d.seleccionado = false);
  }

  haySensoresSeleccionados(): boolean {
    return this.dispositivosDisponibles.some(d => d.seleccionado);
  }
}