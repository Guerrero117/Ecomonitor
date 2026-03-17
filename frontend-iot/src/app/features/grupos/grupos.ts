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
  misGrupos: any[] = [];
  dispositivosDisponibles: any[] = []; 
  mostrarModal: boolean = false;
  nuevoGrupoNombre: string = '';

  constructor(
    private gruposService: GruposService,
    private sensorsService: SensorsService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.gruposService.getGrupos().subscribe({
      next: (data: any[]) => this.misGrupos = data,
      error: (err) => console.error("Error al cargar grupos", err)
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

  abrirModal() { 
    console.log("Botón presionado: abriendo modal");
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
        error: (err) => alert("Error al conectar con .NET")
      });
    }
  }
}