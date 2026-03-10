import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  pantallaActual: 'dashboard' | 'grupos' | 'alertas' | 'config' = 'dashboard';
  mostrarMenu: boolean = false;
  nuevoGrupoNombre: string = '';

  // --- CARDS DE SENSORES ---
  lecturasSensores = [
    { tipo: 'Temperatura', valor: 23, unidad: '°C', estado: 'Normal' },
    { tipo: 'Humedad', valor: 45, unidad: '%', estado: 'Óptimo' },
    { tipo: 'Calidad Aire (CO2)', valor: 850, unidad: 'ppm', estado: 'Advertencia' },
    { tipo: 'Luz', valor: 300, unidad: 'lux', estado: 'Normal' }
  ];

  // --- PANEL CIENTÍFICO ---
  datosEducativos = [
    "Un nivel de CO2 superior a 1000ppm puede reducir la concentración en un 15%.",
    "La humedad ideal para prevenir virus en interiores es del 40% al 60%."
  ];
  imagenesEducativas = [
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=500",
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500"
  ];

  datoActual = this.datosEducativos[0];
  imagenActual = this.imagenesEducativas[0];
  indiceCuriosidad = 0;
  timerCiclo: any;
  recomendacionActual = "⚠️ Niveles de CO2 elevados. Se recomienda ventilar el área.";

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.iniciarCicloEducativo();
  }

  // Función vital para el HTML
  navegarA(pantalla: any) {
    this.pantallaActual = pantalla;
  }

  abrirMenu() { this.mostrarMenu = true; }
  cerrarMenu() { this.mostrarMenu = false; this.nuevoGrupoNombre = ''; }

  iniciarCicloEducativo() {
    this.timerCiclo = setInterval(() => {
      this.indiceCuriosidad = (this.indiceCuriosidad + 1) % this.datosEducativos.length;
      this.datoActual = this.datosEducativos[this.indiceCuriosidad];
      this.imagenActual = this.imagenesEducativas[this.indiceCuriosidad];
      this.cdr.detectChanges(); 
    }, 9000); 
  }

  ngOnDestroy() {
    if (this.timerCiclo) clearInterval(this.timerCiclo);
  }
}