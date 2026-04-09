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

  // Cambiado a line para ver la evolución en el tiempo
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

  public barChartType: ChartType = 'line'; // Cambio de 'bar' a 'line'
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
        // Estos valores de la API sirven como base inicial
        this.tempMax = data.main.temp_max;
        this.tempMin = data.main.temp_min;
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
    
    this.lecturasService.getLecturasPorGrupo(this.grupoSeleccionadoId).subscribe((lecturas: any[]) => {
      if (lecturas && lecturas.length > 0) {
        // Filtrar y ordenar por fecha para la gráfica de evolución
        const lecturasTermicas = lecturas
          .filter(l => 
            (l.tipoDato && l.tipoDato.toLowerCase().includes('temp')) || 
            (l.unidad && l.unidad.includes('°C'))
          )
          .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

        if (lecturasTermicas.length > 0) {
          // Promedio actual (últimas mediciones)
          const suma = lecturasTermicas.reduce((acc, curr) => acc + curr.valor, 0);
          this.tempInterior = suma / lecturasTermicas.length;

          // CÁLCULO DE MÁX/MÍN DEL DÍA (Basado en historial guardado)
          const valores = lecturasTermicas.map(l => l.valor);
          this.tempMax = Math.max(...valores);
          this.tempMin = Math.min(...valores);

          // ACTUALIZAR GRÁFICA EVOLUTIVA
          this.barChartData.labels = lecturasTermicas.map(l => {
            const d = new Date(l.fechaHora);
            return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
          });
          this.barChartData.datasets[1].data = lecturasTermicas.map(l => l.valor);
          this.barChartData.datasets[0].data = lecturasTermicas.map(() => this.tempExterior);
        } else {
          this.tempInterior = 0;
        }
      } else {
        this.tempInterior = 0;
      }
      this.actualizarGrafica();
    });
  }

  actualizarGrafica() {
    this.diferencia = Math.abs(this.tempExterior - this.tempInterior);
    this.barChartData = { ...this.barChartData };
  }
}