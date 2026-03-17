import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GruposService } from '../../core/services/grupos.service';
import { SensorsService } from '../../core/services/sensors';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grupos.html',
  styleUrl: './grupos.css'
})
export class GruposComponent implements OnInit {
  // Datos originales de la BD
  misGrupos: any[] = [];
  dispositivosDisponibles: any[] = []; 
  
  // Variables de control UI
  mostrarModal: boolean = false;
  cargando: boolean = true;
  
  // Modelo para el formulario de nuevo grupo
  nuevoGrupoNombre: string = '';

  // OBJETO DE FILTROS (Lo que Juan quería hacer)
  filters = {
    name: '',
    status: ''
  };

  constructor(
    private gruposService: GruposService,
    private sensorsService: SensorsService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  // GETTER PARA EL BUSCADOR (La clave del éxito)
  // Esta función se ejecuta sola cada vez que escribes en el buscador
  get misGruposFiltrados() {
    return this.misGrupos.filter(grupo => {
      // Filtro por nombre (ignora mayúsculas/minúsculas)
      const coincideNombre = grupo.nombre.toLowerCase().includes(this.filters.name.toLowerCase());
      
      // Filtro por estado (si el selector de estado está vacío, pasan todos)
      const coincideEstado = this.filters.status === '' || grupo.estado === this.filters.status;
      
      return coincideNombre && coincideEstado;
    });
  }

  cargarDatos() {
    this.cargando = true;
    // Llamada limpia al servicio (SIN argumentos, para evitar el error TS2554)
    this.gruposService.getGrupos().subscribe({
      next: (data: any[]) => {
        this.misGrupos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error al cargar grupos", err);
        this.cargando = false;
      }
    });

    this.sensorsService.getSensors().subscribe({
      next: (data: any[]) => {
        this.dispositivosDisponibles = data.map(s => ({
          id: s.id,
          nombre: s.nombre,
          seleccionado: false
        }));
      }
    });
  }

  // --- MÉTODOS DE LA INTERFAZ ---

  abrirModal() { 
    this.mostrarModal = true; 
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoGrupoNombre = '';
    this.dispositivosDisponibles.forEach(d => d.seleccionado = false);
  }

  haySensoresSeleccionados(): boolean {
    return this.dispositivosDisponibles.some(d => d.seleccionado);
  }

  guardarGrupo() {
    if (this.nuevoGrupoNombre.trim() !== '') {
      const seleccionados = this.dispositivosDisponibles
        .filter(d => d.seleccionado)
        .map(d => d.id);

      const nuevoGrupo = {
        nombre: this.nuevoGrupoNombre,
        sensoresIds: seleccionados, 
        estado: 'Activo'
      };

      this.gruposService.crearGrupo(nuevoGrupo).subscribe({
        next: () => {
          this.cargarDatos(); 
          this.cerrarModal();
        },
        error: (err) => alert("Error al conectar con .NET. Verifica que el Backend esté corriendo.")
      });
    }
  }
}