import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para standalone
import { WeatherService } from '../../core/services/weather.service';
import { LecturasService } from '../../core/services/lecturas.service';
import { SensorsService } from '../../core/services/sensors';

@Component({
  selector: 'app-clima-comparativo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clima-comparativo.html',
  styleUrls: ['./clima-comparativo.css']
})
export class ClimaComparativoComponent implements OnInit {
  tempExterior: number = 0;
  tempInterior: number = 0;
  diferencia: number = 0;
  ciudad: string = 'Ciudad Obregón';
  cargando: boolean = true;

  constructor(
    private weatherService: WeatherService,
    private lecturasService: LecturasService,
    private sensorsService: SensorsService
  ) {}

  ngOnInit() {
    // 1. Obtener clima de la API (Exterior)
    this.weatherService.getClimaExterior().subscribe({
      next: (data: any) => {
        this.tempExterior = data.main.temp;
        this.calcularDiferencia();
      },
      error: (err) => console.error("Error API Clima:", err)
    });

    // 2. Buscar un sensor real y obtener su última lectura (Interior)
    this.sensorsService.getSensors().subscribe((sensores: any[]) => {
      // Buscamos el primer sensor que sea de temperatura
      const sensorTemp = sensores.find(s => s.tipo.toLowerCase().includes('temp'));
      
      if (sensorTemp) {
        this.lecturasService.getLecturasPorSensor(sensorTemp.id).subscribe((lecturas: any) => {
          if (lecturas.length > 0) {
            this.tempInterior = lecturas[0].valor;
            this.calcularDiferencia();
          }
          this.cargando = false;
        });
      } else {
        this.cargando = false;
        console.warn("No se encontró un sensor de temperatura.");
      }
    });
  }

  calcularDiferencia() {
    this.diferencia = Math.abs(this.tempExterior - this.tempInterior);
  }
}