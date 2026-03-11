import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Este componente es independiente, no necesita estar en un módulo grande
  imports: [CommonModule, FormsModule, RouterModule], // Cargamos herramientas de Angular para el HTML y las rutas
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  /* --- CONTROL DE LA VISTA --- */
  // Esta variable nos dice en qué sección estamos para iluminar los botones del menú
  pantallaActual: 'dashboard' | 'grupos' | 'alertas' | 'config' | 'sensores' = 'dashboard';
  mostrarMenu: boolean = false;
  nuevoGrupoNombre: string = '';

  /* --- DATOS DE LOS SENSORES (Simulados) --- */
  // Aquí guardamos la info que se ve en las tarjetas (cards) del inicio
  lecturasSensores = [
    { tipo: 'Temperatura', valor: 23, unidad: '°C', estado: 'Normal' },
    { tipo: 'Humedad', valor: 45, unidad: '%', estado: 'Óptimo' },
    { tipo: 'Calidad Aire (CO2)', valor: 850, unidad: 'ppm', estado: 'Advertencia' },
    { tipo: 'Luz', valor: 300, unidad: 'lux', estado: 'Normal' }
  ];

  /* --- SECCIÓN EDUCATIVA (Lo que cambia cada 9 segundos) --- */
  // Lista de textos que van a ir rotando en el panel superior
  datosEducativos = [
    "Un nivel de CO2 superior a 1000ppm puede reducir la concentración en un 15%.",
    "La humedad ideal para prevenir virus en interiores es del 40% al 60%.",
    "El monitoreo constante ayuda a reducir el gasto energético en un 20%."
  ];

  // Links de las fotos que acompañan a cada texto educativo
  imagenesEducativas = [
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=500",
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500"
  ];

  // Variables que el HTML usa para mostrar el dato del momento
  datoActual = this.datosEducativos[0];
  imagenActual = this.imagenesEducativas[0];
  indiceCuriosidad = 0; // Para saber en qué número de dato vamos
  timerCiclo: any;      // Aquí guardamos el reloj del ciclo para poder apagarlo luego
  recomendacionActual = "⚠️ Niveles de CO2 elevados. Se recomienda ventilar el área.";

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  // Este método corre apenas el componente aparece en pantalla
  ngOnInit() {
    this.iniciarCicloEducativo(); // Arrancamos el contador de 9 segundos
  }

  /* --- CONTROL DE NAVEGACIÓN --- */
  // Esta función se activa cuando haces clic en cualquier botón del sidebar
  navegarA(pantalla: any) {
    this.pantallaActual = pantalla; // Marcamos qué pantalla elegimos
    
    // Si elegimos 'sensores', el Router nos manda a la sub-ruta que creamos
    if (pantalla === 'sensores') {
      this.router.navigate(['/dashboard/devices']);
    }
  }

  // Funciones simples para manejar la apertura del menú de grupos
  abrirMenu() { this.mostrarMenu = true; }
  cerrarMenu() { this.mostrarMenu = false; this.nuevoGrupoNombre = ''; }

  /* --- EL RELOJ DE 9 SEGUNDOS --- */
  // Función que se encarga de cambiar los textos e imágenes automáticamente
  iniciarCicloEducativo() {
    this.timerCiclo = setInterval(() => {
      // Avanzamos al siguiente dato. El '%' hace que si llega al final, vuelva a empezar desde 0.
      this.indiceCuriosidad = (this.indiceCuriosidad + 1) % this.datosEducativos.length;
      
      this.datoActual = this.datosEducativos[this.indiceCuriosidad];
      this.imagenActual = this.imagenesEducativas[this.indiceCuriosidad];
      
      // detectChanges() es un empujoncito para que Angular refresque la imagen en el HTML de inmediato
      this.cdr.detectChanges(); 
    }, 9000); // 9000ms son exactamente los 9 segundos que pide el proyecto
  }

  // Muy importante: Si cerramos el dashboard, borramos el reloj para que no siga gastando memoria
  ngOnDestroy() {
    if (this.timerCiclo) clearInterval(this.timerCiclo);
  }
}