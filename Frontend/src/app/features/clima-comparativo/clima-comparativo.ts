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
  }

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
      error: (err) => {
        console.error('Error al cargar grupos:', err);
        this.cargando = false;
      }
    });
  }

  onGrupoChange() {
    if (!this.grupoSeleccionadoId) return;
    
    // aqui usamos el servicio de grupos que si jalo en el otro componente
    this.gruposService.getLecturasGrupo(this.grupoSeleccionadoId).subscribe({
      next: (lecturas: any[]) => {
        if (lecturas && lecturas.length > 0) {
          
          // filtramos para sacar nomas la pura temperatura
          const lecturasNormalizadas = lecturas.map(l => ({
            valorTemp: l.temperatura !== undefined ? l.temperatura : l.Temperatura,
            fechaRelativa: l.fecha || l.Fecha || new Date()
          })).filter(l => l.valorTemp !== undefined && l.valorTemp !== null);

          if (lecturasNormalizadas.length > 0) {
            // acomodamos por fecha
            lecturasNormalizadas.sort((a, b) => new Date(a.fechaRelativa).getTime() - new Date(b.fechaRelativa).getTime());

            // promedio de los nodos
            const suma = lecturasNormalizadas.reduce((acc, curr) => acc + curr.valorTemp, 0);
            this.tempInterior = suma / lecturasNormalizadas.length;

            // maximas y minimas
            const valores = lecturasNormalizadas.map(l => l.valorTemp);
            this.tempMax = Math.max(...valores);
            this.tempMin = Math.min(...valores);

            // llenamos la grafica
            this.barChartData.labels = lecturasNormalizadas.map(l => {
              const d = new Date(l.fechaRelativa);
              return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
            });

            this.barChartData.datasets[1].data = valores;
            this.barChartData.datasets[0].data = lecturasNormalizadas.map(() => this.tempExterior);
          } else {
            this.limpiarVista();
          }
        } else {
          this.limpiarVista();
        }
        this.actualizarGrafica();
      },
      error: () => {
        this.limpiarVista();
        this.actualizarGrafica();
      }
    });
  }

  limpiarVista() {
    this.tempInterior = 0;
    this.tempMax = 0;
    this.tempMin = 0;
    this.barChartData.labels = [];
    this.barChartData.datasets[1].data = [];
  }

  actualizarGrafica() {
    this.diferencia = Math.abs(this.tempExterior - this.tempInterior);
    this.barChartData = { ...this.barChartData };
  }
}