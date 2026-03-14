import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importante para el selector
import { WeatherService } from '../../core/services/weather.service';
import { LecturasService } from '../../core/services/lecturas.service';
import { GruposService } from '../../core/services/grupos.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-clima-comparativo',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './clima-comparativo.html',
  styleUrls: ['./clima-comparativo.css']
})
export class ClimaComparativoComponent implements OnInit {
  // Datos Clima Exterior
  tempExterior: number = 0;
  humedadExterior: number = 0;
  tempMax: number = 0;
  tempMin: number = 0;

  // Datos Interior (Promedio del Grupo)
  tempInterior: number = 0;
  diferencia: number = 0;
  
  // Gestión de Grupos
  listaGrupos: any[] = [];
  grupoSeleccionadoId: string = '';
  cargando: boolean = true;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
      x: { ticks: { color: '#fff' } }
    },
    plugins: { legend: { labels: { color: '#fff' } } }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Temperatura (°C)'],
    datasets: [
      { data: [0], label: 'Obregón (Exterior)', backgroundColor: '#3b82f6' },
      { data: [0], label: 'Área Local (Interior)', backgroundColor: '#10b981' }
    ]
  };

  constructor(
    private weatherService: WeatherService,
    private lecturasService: LecturasService,
    private gruposService: GruposService
  ) {}

  ngOnInit() {
    this.cargarClimaExterior();
    this.cargarGrupos();
  }

  cargarClimaExterior() {
    this.weatherService.getClimaExterior().subscribe({
      next: (data) => {
        this.tempExterior = data.main.temp;
        this.humedadExterior = data.main.humidity;
        this.tempMax = data.main.temp_max;
        this.tempMin = data.main.temp_min;
        this.actualizarGrafica();
      }
    });
  }

  cargarGrupos() {
    this.gruposService.getGrupos().subscribe(grupos => {
      this.listaGrupos = grupos;
      if (grupos.length > 0) {
        this.grupoSeleccionadoId = grupos[0].id;
        this.onGrupoChange();
      }
      this.cargando = false;
    });
  }

  // Se ejecuta cuando cambias el grupo en el selector
  onGrupoChange() {
    if (!this.grupoSeleccionadoId) return;
    
    // Llamamos al nuevo endpoint del backend que hicimos antes
    this.lecturasService.getLecturasPorGrupo(this.grupoSeleccionadoId).subscribe((lecturas: any[]) => {
      if (lecturas.length > 0) {
        // Calculamos el promedio de las últimas lecturas de los sensores del grupo
        const suma = lecturas.reduce((acc, curr) => acc + curr.valor, 0);
        this.tempInterior = suma / lecturas.length;
      } else {
        this.tempInterior = 0;
      }
      this.actualizarGrafica();
    });
  }

  actualizarGrafica() {
    this.diferencia = Math.abs(this.tempExterior - this.tempInterior);
    this.barChartData.datasets[0].data = [this.tempExterior];
    this.barChartData.datasets[1].data = [this.tempInterior];
    this.barChartData = { ...this.barChartData };
  }
}