import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Router } from '@angular/router';
import { LecturasService } from '../../core/services/lecturas.service';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  pantallaActual: 'dashboard' | 'grupos' | 'alertas' | 'config' | 'sensores' | 'entrada-manual' | 'clima' | 'admin-users' = 'dashboard';
  timestamp: Date = new Date();
  idGrupoActual: string = "65f8a1b2c3d4e5f67890abcd"; 
  
  lecturasSensores: any[] = [];
  recomendacionActual: string = "Iniciando sistema de monitoreo...";

  datosEducativos = [
    "El sensor FC-22 detecta gases inflamables y calidad del aire en tiempo real.",
    "La humedad ideal para prevenir virus en interiores es del 40% al 60%.",
    "El fotoreceptor permite medir la eficiencia lumínica del entorno (Lux).",
    "Un nivel de CO2 superior a 1000ppm puede reducir la concentración en un 15%."
  ];

  imagenesEducativas = [
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=500",
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=500"
  ];

  datoActual = this.datosEducativos[0];
  imagenActual = this.imagenesEducativas[0];
  indiceCuriosidad = 0;

  private timerLecturas: any;
  private timerCiclo: any;
  private timerReloj: any;

  constructor(
    private lecturasService: LecturasService,
    public auth: AuthService, 
    private cdr: ChangeDetectorRef, 
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerLecturasDeMongo();
    this.timerLecturas = setInterval(() => {
      if (this.pantallaActual === 'dashboard') this.obtenerLecturasDeMongo();
    }, 10000);

    this.iniciarCicloEducativo();
    this.timerReloj = setInterval(() => { this.timestamp = new Date(); }, 1000);
  }

  obtenerLecturasDeMongo() {
    this.lecturasService.getLecturasPorGrupo(this.idGrupoActual).subscribe({
      next: (data) => {
        this.lecturasSensores = data.map(lectura => ({
          nombre: `NODO_${lectura.sensorId.slice(-4).toUpperCase()}`,
          tipo: this.mapearTipo(lectura.unidad),
          valor: lectura.valor,
          unidad: lectura.unidad,
          estado: this.definirEstado(lectura.valor, lectura.unidad),
          icon: this.mapearIcono(lectura.unidad)
        }));
        this.procesarAlertas();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error backend:", err);
        this.recomendacionActual = "⚠️ Error: No se pudo conectar con el servidor.";
      }
    });
  }

  private mapearTipo(u: string): string {
    if (u === 'ppm') return 'Calidad Aire (Gas)';
    if (u === 'lux') return 'Luminosidad';
    if (u === '°C') return 'Temperatura';
    return 'Sensor IoT';
  }

  private mapearIcono(u: string): string {
    const iconos: any = { 'ppm': '🍃', 'lux': '☀️', '°C': '🌡️', '%': '💧' };
    return iconos[u] || '📊';
  }

  private definirEstado(v: number, u: string): string {
    if (u === 'ppm' && v > 800) return 'Advertencia';
    if (u === 'lux' && v < 200) return 'Baja Luz';
    return 'Óptimo';
  }

  private procesarAlertas() {
    const gas = this.lecturasSensores.find(s => s.unidad === 'ppm');
    this.recomendacionActual = (gas && gas.valor > 800) 
      ? "⚠️ Niveles de gas elevados detectados. Ventilar área." 
      : "✅ Todos los sistemas operando normalmente.";
  }

  navegarA(pantalla: any) {
    this.pantallaActual = pantalla; 
    const rutas: any = {
      'dashboard': '/dashboard',
      'sensores': '/dashboard/devices',
      'entrada-manual': '/dashboard/entrada-manual',
      'clima': '/dashboard/clima-comparativo',
      'grupos': '/dashboard/grupos',
      'alertas': '/dashboard/alertas',
      'admin-users': '/dashboard/admin-users'
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
    if (this.timerLecturas) clearInterval(this.timerLecturas);
    if (this.timerCiclo) clearInterval(this.timerCiclo);
    if (this.timerReloj) clearInterval(this.timerReloj);
  }
}