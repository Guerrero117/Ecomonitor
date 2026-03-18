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

  // Getter para que el HTML no de error al buscar 'misGruposFiltrados'
  get misGruposFiltrados() {
    return this.misGrupos.filter(g => 
      g.nombre.toLowerCase().includes(this.filters.name.toLowerCase())
    );
  }

  ngOnInit() { 
    if (isPlatformBrowser(this.platformId)) {
      this.cargarDatos(); 
    }
  }

  private getUserId(): string {
    if (isPlatformBrowser(this.platformId)) {
      const sesion = localStorage.getItem('usuario');
      if (!sesion) return '';
      try {
        const user = JSON.parse(sesion);
        return user.id || user._id || '';
      } catch (e) { return ''; }
    }
    return '';
  }

  cargarDatos() {
    const userId = this.getUserId();
    if (!userId) return;

    this.gruposService.getGrupos(userId).subscribe({
      next: (data: any[]) => this.misGrupos = data
    });

    this.sensorsService.getSensorsByUser(userId).subscribe({
      next: (data: any[]) => {
        this.dispositivosDisponibles = data.map((s: any) => ({
          ...s,
          seleccionado: false
        }));
      }
    });
  }

  haySensoresSeleccionados(): boolean {
    return this.dispositivosDisponibles.some(d => d.seleccionado);
  }

  guardarGrupo() {
    const userId = this.getUserId();
    const seleccionados = this.dispositivosDisponibles
      .filter(d => d.seleccionado)
      .map(d => d.id || d._id);

    const nuevoGrupo = {
      nombre: this.nuevoGrupoNombre,
      sensoresIds: seleccionados, 
      estado: 'Activo',
      usuarioId: userId
    };

    this.gruposService.crearGrupo(nuevoGrupo).subscribe({
      next: () => {
        this.cargarDatos(); 
        this.cerrarModal();
        Swal.fire('Éxito', 'Grupo creado', 'success');
      }
    });
  }

  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { this.mostrarModal = false; this.nuevoGrupoNombre = ''; }
}