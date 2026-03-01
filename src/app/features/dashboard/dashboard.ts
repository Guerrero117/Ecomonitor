import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  // --- CONTROL DE NAVEGACIÓN ---
  // Esta variable decide qué sección se muestra en el HTML
  pantallaActual: 'dashboard' | 'grupos' | 'alertas' | 'config' = 'dashboard';

  // --- DATOS DE SENSORES (Dashboard) ---
  lecturasSensores = [
    { tipo: 'Temperatura', valor: 23, unidad: '°C', estado: 'Normal' },
    { tipo: 'Humedad', valor: 45, unidad: '%', estado: 'Óptimo' },
    { tipo: 'Calidad Aire (CO2)', valor: 850, unidad: 'ppm', estado: 'Advertencia' },
    { tipo: 'Luz', valor: 300, unidad: 'lux', estado: 'Normal' }
  ];

  // --- DATOS DE GESTIÓN (Mis Grupos) ---
  misGrupos = [
    { id: 1, nombre: 'Oficina Principal', dispositivos: 3, estado: 'Activo' },
    { id: 2, nombre: 'Invernadero Beta', dispositivos: 5, estado: 'Mantenimiento' },
    { id: 3, nombre: 'Laboratorio Química', dispositivos: 2, estado: 'Activo' }
  ];

  // --- DATOS DE AUDITORÍA (Alertas) ---
  historialAlertas = [
    { fecha: '2026-03-01 08:30', evento: 'CO2 Elevado', zona: 'Oficina', nivel: 'Crítico' },
    { fecha: '2026-02-28 14:15', evento: 'Batería Baja Sensor 04', zona: 'Invernadero', nivel: 'Bajo' },
    { fecha: '2026-02-28 10:00', evento: 'Conexión Perdida Gateway', zona: 'Sistema', nivel: 'Medio' }
  ];

  // --- PANEL CIENTÍFICO (Ciclo de 9s) ---
  datosEducativos = [
    "Un nivel de CO2 superior a 1000ppm puede reducir la concentración en un 15%.",
    "La humedad ideal para prevenir virus en interiores es del 40% al 60%.",
    "Las plantas en oficinas reducen el estrés y purifican toxinas del aire.",
    "El índice de confort térmico ayuda a optimizar el gasto energético."
  ];

  imagenesEducativas = [
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=500",
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500",
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=500",
    "https://images.unsplash.com/photo-1473186578172-c141e6798ee4?q=80&w=500"
  ];

  datoActual = this.datosEducativos[0];
  imagenActual = this.imagenesEducativas[0];
  indiceCuriosidad = 0;
  timerCiclo: any;
  recomendacionActual = "El ambiente es saludable. No se requieren acciones.";

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.evaluarEntorno();
    this.iniciarCicloEducativo();
  }

  // Función para cambiar de pantalla al hacer clic en el menú
  navegarA(pantalla: 'dashboard' | 'grupos' | 'alertas' | 'config') {
    this.pantallaActual = pantalla;
  }

  // Lógica de 9 segundos para el panel científico
  iniciarCicloEducativo() {
    this.timerCiclo = setInterval(() => {
      this.indiceCuriosidad = (this.indiceCuriosidad + 1) % this.datosEducativos.length;
      this.datoActual = this.datosEducativos[this.indiceCuriosidad];
      this.imagenActual = this.imagenesEducativas[this.indiceCuriosidad];
      this.cdr.detectChanges(); 
    }, 9000); 
  }

  evaluarEntorno() {
    const co2Obj = this.lecturasSensores.find(s => s.tipo.includes('CO2'));
    if (co2Obj && co2Obj.valor > 800) {
      this.recomendacionActual = "⚠️ Niveles de CO2 elevados. Se recomienda ventilar el área.";
    }
  }

  ngOnDestroy() {
    if (this.timerCiclo) clearInterval(this.timerCiclo);
  }
}