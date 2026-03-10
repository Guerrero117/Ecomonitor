import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grupos.html',
  styleUrl: './grupos.css'
})




export class GruposComponent {
  misGrupos = [
    { id: 1, nombre: 'Oficina Principal', dispositivos: 3, estado: 'Activo' },
    { id: 2, nombre: 'Invernadero Beta', dispositivos: 5, estado: 'Mantenimiento' }
  ];

  // --- NUEVO: Lista de dispositivos para elegir ---
  dispositivosDisponibles = [
    { id: 'T01', nombre: 'Sensor Temperatura A1', seleccionado: false },
    { id: 'H01', nombre: 'Sensor Humedad B2', seleccionado: false },
    { id: 'C01', nombre: 'Monitor CO2 Central', seleccionado: false },
    { id: 'L01', nombre: 'Sensor Luz Solar', seleccionado: false }
  ];

  mostrarModal: boolean = false;
  nuevoGrupoNombre: string = '';

  abrirModal() { this.mostrarModal = true; }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoGrupoNombre = '';
    // Limpiamos la selección al cerrar
    this.dispositivosDisponibles.forEach(d => d.seleccionado = false);
  }

  guardarGrupo() {
    if (this.nuevoGrupoNombre.trim() !== '') {
      // Contamos cuántos dispositivos se seleccionaron
      const seleccionados = this.dispositivosDisponibles.filter(d => d.seleccionado).length;

      this.misGrupos.push({
        id: this.misGrupos.length + 1,
        nombre: this.nuevoGrupoNombre,
        dispositivos: seleccionados, // 👈 Ahora sí guarda la cantidad real
        estado: 'Activo'
      });
      this.cerrarModal();
    }
  }
}