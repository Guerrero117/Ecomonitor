import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
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

  // Datos Interior
  tempInterior: number = 0;
  diferencia: number = 0;
  
  // Gestión de Grupos y Filtro
  listaGrupos: any[] = [];
  grupoSeleccionadoId: string = '';
  cargando: boolean = true;
  filtroBusqueda: string = ''; 

  // Configuración de Gráfica
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    },
    plugins: { 
      legend: { labels: { color: '#f1f5f9', font: { weight: 'bold' } } } 
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Temperatura (°C)'],
    datasets: [
      { data: [0], label: 'Obregón (Exterior)', backgroundColor: '#3b82f6', borderRadius: 8 },
      { data: [0], label: 'Área Local (Interior)', backgroundColor: '#10b981', borderRadius: 8 }
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

  // Helper para obtener el ID de la sesión (Igual que en Grupos)
  private getLoggedUserId(): string {
    const userSession = localStorage.getItem('usuario');
    if (userSession) {
      const user = JSON.parse(userSession);
      return user.id || user._id; 
    }
    return '';
  }

  // Lógica del Buscador/Filtro
  get gruposFiltrados() {
    return this.listaGrupos.filter(g => 
      g.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
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
    const userId = this.getLoggedUserId();
    if (!userId) {
      this.cargando = false;
      return;
    }

    // Corregido: Ahora pasamos el userId al servicio
    this.gruposService.getGrupos(userId).subscribe(grupos => {
      this.listaGrupos = grupos;
      if (grupos.length > 0) {
        this.grupoSeleccionadoId = grupos[0].id;
        this.onGrupoChange();
      }
      this.cargando = false;
    });
  }

  onGrupoChange() {
    if (!this.grupoSeleccionadoId) return;
    
    this.lecturasService.getLecturasPorGrupo(this.grupoSeleccionadoId).subscribe((lecturas: any[]) => {
      if (lecturas.length > 0) {
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