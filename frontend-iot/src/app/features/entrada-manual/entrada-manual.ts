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
  ultimasLecturas: any[] = []; 
  
  lectura = {
    sensorId: '',
    valor: null as number | null,
    unidad: '°C'
  };

  // Control para evitar errores de usuario
  unidadBloqueada: boolean = false;

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
      const sensorSeleccionado = this.listaSensores.find(s => s.id === this.lectura.sensorId);
      
      if (sensorSeleccionado) {
        this.validarTipoDeSensor(sensorSeleccionado.tipo);
        this.obtenerHistorial(this.lectura.sensorId);
      }
    }
  }

  // Detecta el tipo y asigna la unidad correcta
  private validarTipoDeSensor(tipo: string) {
    const t = tipo.toLowerCase();
    
    if (t.includes('temp')) {
      this.lectura.unidad = '°C';
      this.unidadBloqueada = true;
    } else if (t.includes('hum')) {
      this.lectura.unidad = '%';
      this.unidadBloqueada = true;
    } else if (t.includes('co2')) {
      this.lectura.unidad = 'ppm';
      this.unidadBloqueada = true;
    } else {
      // Si el sensor no es reconocido, permitimos que el usuario elija
      this.unidadBloqueada = false;
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
        this.obtenerHistorial(this.lectura.sensorId);
        this.lectura.valor = null; // Limpiamos valor para nueva entrada
      },
      error: (err: any) => {
        console.error(err);
        alert("❌ Error al guardar. Revisa la conexión con el Backend.");
      }
    });
  }
}