import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LecturasService } from '../../core/services/lecturas.service';
import { SensorsService } from '../../core/services/sensors';

@Component({
  selector: 'app-entrada-manual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrada-manual.html',
  styleUrl: './entrada-manual.css'
})
export class EntradaManualComponent implements OnInit {
  listaSensores: any[] = [];
  ultimasLecturas: any[] = []; // Almacena el historial del sensor seleccionado
  
  lectura = {
    sensorId: '',
    valor: null as number | null,
    unidad: '°C'
  };

  constructor(
    private lecturasService: LecturasService,
    private sensorsService: SensorsService
  ) {}

  ngOnInit() {
    this.cargarSensores();
  }

  cargarSensores() {
    this.sensorsService.getSensors().subscribe({
      next: (data: any) => this.listaSensores = data,
      error: (err) => console.error("Error al cargar sensores", err)
    });
  }

  // Se ejecuta al cambiar de sensor en el select
  onSensorChange() {
    if (this.lectura.sensorId) {
      this.obtenerHistorial(this.lectura.sensorId);
    }
  }

  obtenerHistorial(id: string) {
    this.lecturasService.getLecturasPorSensor(id).subscribe({
      next: (data: any) => this.ultimasLecturas = data,
      error: (err) => console.error("Error al obtener historial", err)
    });
  }

  guardarDato() {
    if (!this.lectura.sensorId || this.lectura.valor === null) {
      alert("⚠️ Por favor, selecciona un sensor y escribe un valor.");
      return;
    }

    this.lecturasService.enviarLecturaManual(this.lectura).subscribe({
      next: (res: any) => {
        alert("✅ ¡Dato registrado en MongoDB Atlas!");
        // Actualizamos la tabla automáticamente
        this.obtenerHistorial(this.lectura.sensorId);
        // Limpiamos solo el valor para permitir otra entrada rápida
        this.lectura.valor = null;
      },
      error: (err: any) => {
        console.error(err);
        alert("❌ Error al guardar. Revisa la conexión con el Backend.");
      }
    });
  }
}