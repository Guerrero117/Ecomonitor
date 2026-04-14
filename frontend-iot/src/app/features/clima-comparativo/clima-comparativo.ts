import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { WeatherService } from '../../core/services/weather.service';
import { LecturasService } from '../../core/services/lecturas.service';
import { GruposService } from '../../core/services/grupos.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-clima-comparativo',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './clima-comparativo.html',
  styleUrls: ['./clima-comparativo.css']
})
export class ClimaComparativoComponent implements OnInit, OnDestroy {
  tempExterior: number = 0;
  humedadExterior: number = 0;
  tempMax: number = 0;
  tempMin: number = 0;
  tempInterior: number = 0;
  diferencia: number = 0;
  
  listaGrupos: any[] = [];
  grupoSeleccionadoId: string = '';
  cargando: boolean = true;
  filtroBusqueda: string = ''; 
  
  private refreshSub?: Subscription;

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

  public barChartType: ChartType = 'line';
  public barChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Exterior (Obregón)', 
        borderColor: '#3b82f6', 
        backgroundColor: 'rgba(59, 130, 246, 0.1)', 
        fill: true,
        tension: 0.4
      },
      { 
        data: [], 
        label: 'Interior (Sensores)', 
        borderColor: '#10b981', 
        backgroundColor: 'rgba(16, 185, 129, 0.1)', 
        fill: true,
        tension: 0.4
      }
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
    
    // Configurar refresco automático cada 10 segundos
    this.refreshSub = interval(10000).subscribe(() => {
      this.cargarClimaExterior();
      this.onGrupoChange();
    });
  }

  ngOnDestroy() {
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  cargarClimaExterior() {
    this.weatherService.getClimaExterior().subscribe({
      next: (data) => {
        this.tempExterior = data.main.temp;
        this.humedadExterior = data.main.humidity;
        this.actualizarGrafica();
      }
    });
  }

  cargarGrupos() {
    this.gruposService.getGrupos().subscribe({
      next: (grupos) => {
        this.listaGrupos = grupos;
        if (grupos.length > 0) {
          this.grupoSeleccionadoId = grupos[0].id || grupos[0]._id;
          this.onGrupoChange();
        }
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  onGrupoChange() {
    if (!this.grupoSeleccionadoId) return;
    
    this.lecturasService.getLecturasPorGrupo(this.grupoSeleccionadoId).subscribe((lecturas: any[]) => {
      if (lecturas && lecturas.length > 0) {
        const lecturasTermicas = lecturas
          .filter(l => l.unidad === '°C')
          .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

        if (lecturasTermicas.length > 0) {
          const suma = lecturasTermicas.reduce((acc, curr) => acc + curr.valor, 0);
          this.tempInterior = suma / lecturasTermicas.length;

          const valores = lecturasTermicas.map(l => l.valor);
          this.tempMax = Math.max(...valores);
          this.tempMin = Math.min(...valores);

          this.barChartData.labels = lecturasTermicas.map(l => {
            const d = new Date(l.fechaHora);
            return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
          });
          this.barChartData.datasets[1].data = lecturasTermicas.map(l => l.valor);
          this.barChartData.datasets[0].data = lecturasTermicas.map(() => this.tempExterior);
        }
      }
      this.actualizarGrafica();
    });
  }

  actualizarGrafica() {
    this.diferencia = Math.abs(this.tempExterior - this.tempInterior);
    this.barChartData = { ...this.barChartData };
  }
}