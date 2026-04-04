import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Router } from '@angular/router';
import { LecturasService } from '../../core/services/lecturas.service';
import { AuthService } from '../../core/services/auth';
import { WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  pantallaActual: 'dashboard' | 'grupos' | 'alertas' | 'config' | 'sensores' | 'entrada-manual' | 'clima' | 'admin-users' | 'admin-logs' = 'dashboard';
  timestamp: Date = new Date();
  
  datosObregon: any = {
    temp: 0,
    hum: 0,
    sensation: 0,
    presion: 0,
    viento: 0,
    nubes: 0,
    descripcion: 'Sincronizando...',
    ciudad: 'Ciudad Obregón'
  };

  recomendacionActual: string = "Obteniendo datos de la estación meteorológica...";

  datosEducativos = [
    "Ciudad Obregón tiene un clima desértico; la hidratación de tus plantas es clave.",
    "La presión atmosférica influye en la precisión de los sensores de gas.",
    "Vientos superiores a 5m/s pueden afectar las lecturas de humedad exterior.",
    "La sensación térmica en Sonora puede variar significativamente respecto a la temperatura real."
  ];

  imagenesEducativas = [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=500",
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500",
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=500"
  ];

  datoActual = this.datosEducativos[0];
  imagenActual = this.imagenesEducativas[0];
  indiceCuriosidad = 0;

  private timerApi: any;
  private timerCiclo: any;
  private timerReloj: any;

  constructor(
    private weatherService: WeatherService,
    public auth: AuthService, 
    private cdr: ChangeDetectorRef, 
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatosExternos();
    
    // REDUCIDO: Actualizar datos de la API cada 30 segundos para "Tiempo Real"
    this.timerApi = setInterval(() => {
      this.cargarDatosExternos();
    }, 30000); 

    this.iniciarCicloEducativo();
    this.timerReloj = setInterval(() => { this.timestamp = new Date(); }, 1000);
  }

  cargarDatosExternos() {
    this.weatherService.getClimaExterior().subscribe({
      next: (res) => {
        // Mapeo de datos recibidos
        this.datosObregon = {
          temp: Math.round(res.main.temp),
          hum: res.main.humidity,
          sensation: Math.round(res.main.feels_like),
          presion: res.main.pressure,
          viento: res.wind.speed,
          nubes: res.clouds.all,
          descripcion: res.weather[0].description.toUpperCase(),
          ciudad: res.name
        };

        this.recomendacionActual = `Clima en Obregón: ${this.datosObregon.descripcion} ✅`;
        
        // Esto fuerza a Angular a pintar los nuevos datos inmediatamente
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error API Externo:", err);
        this.recomendacionActual = "⚠️ Error: No se pudo conectar con el servidor de clima.";
      }
    });
  }

  // ... (tus funciones navegarA, logout e iniciarCicloEducativo quedan igual) ...

  navegarA(pantalla: any) {
    this.pantallaActual = pantalla; 
    const rutas: any = {
      'dashboard': '/dashboard',
      'sensores': '/dashboard/devices',
      'entrada-manual': '/dashboard/entrada-manual',
      'clima': '/dashboard/clima-comparativo',
      'grupos': '/dashboard/grupos',
      'alertas': '/dashboard/alertas',
      'admin-users': '/dashboard/admin-users',
      'admin-logs': '/dashboard/admin-logs'
    };
    if (rutas[pantalla]) this.router.navigate([rutas[pantalla]]);
  }

  logout() { this.auth.logout(); }

  iniciarCicloEducativo() {
    this.timerCiclo = setInterval(() => {
      this.indiceCuriosidad = (this.indiceCuriosidad + 1) % this.datosEducativos.length;
      this.datoActual = this.datosEducativos[this.indiceCuriosidad];
      this.imagenActual = this.imagenesEducativas[this.indiceCuriosidad];
      this.cdr.detectChanges(); 
    }, 9000); 
  }

  ngOnDestroy() {
    if (this.timerApi) clearInterval(this.timerApi);
    if (this.timerCiclo) clearInterval(this.timerCiclo);
    if (this.timerReloj) clearInterval(this.timerReloj);
  }
}