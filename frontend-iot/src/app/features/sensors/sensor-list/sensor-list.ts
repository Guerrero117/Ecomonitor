import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sensor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sensor-list.html',
  styleUrl: './sensor-list.css'
})
export class SensorListComponent implements OnInit {
  sensors: any[] = [];
  mostrarModal = false;
  cargando = false;
  nuevoSensor = { nombre: '', tipo: 'Temperatura', frecuencia: 10 };
  private API_URL = 'http://localhost:5126/api/sensors';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarSensores();
    }
  }

  private getUserId(): string {
    if (isPlatformBrowser(this.platformId)) {
      const sesion = localStorage.getItem('usuario');
      if (!sesion) return '';
      try {
        const user = JSON.parse(sesion);
        return user.id || user._id || '';
      } catch (e) { return ''; }
    }
    return '';
  }

  cargarSensores() {
    const userId = this.getUserId();
    
    // Si tienes un ID de usuario, buscamos los tuyos
    if (userId) {
      this.http.get<any[]>(`${this.API_URL}/user/${userId}`).subscribe({
        next: (res) => {
          this.sensors = res;
          // Si tu usuario no tiene sensores aún, cargamos TODOS para que veas los anteriores
          if (this.sensors.length === 0) {
            this.cargarTodosLosSensores();
          }
        },
        error: (err) => {
          console.error('Error al cargar sensores del usuario, cargando generales...', err);
          this.cargarTodosLosSensores();
        }
      });
    } else {
      this.cargarTodosLosSensores();
    }
  }

  // Nueva función para cargar absolutamente todo lo que hay en la DB
  private cargarTodosLosSensores() {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (res) => this.sensors = res,
      error: (err) => console.error('Error al cargar todos los sensores:', err)
    });
  }

  guardarSensor() {
    const userId = this.getUserId();
    if (!userId) {
        Swal.fire('Error', 'No se detectó sesión de usuario', 'error');
        return;
    }

    this.cargando = true;
    const payload = { ...this.nuevoSensor, usuarioId: userId, estado: true };

    this.http.post(this.API_URL, payload).subscribe({
      next: () => {
        this.cargarSensores();
        this.cerrarModal();
        this.cargando = false;
        Swal.fire('Éxito', 'Sensor guardado correctamente', 'success');
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudo guardar', 'error');
      }
    });
  }

  borrarSensor(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.API_URL}/${id}`).subscribe({
          next: () => {
            this.cargarSensores();
            Swal.fire('Eliminado', 'El sensor ha sido borrado', 'success');
          }
        });
      }
    });
  }

  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { 
    this.mostrarModal = false; 
    this.nuevoSensor = { nombre: '', tipo: 'Temperatura', frecuencia: 10 }; 
  }

  getIcon(tipo: string) {
    const icons: any = { 
      'Temperatura': 'fas fa-thermometer-half', 
      'Humedad': 'fas fa-tint', 
      'Radiación UV': 'fas fa-sun', 
      'CO2': 'fas fa-cloud' 
    };
    return icons[tipo] || 'fas fa-microchip';
  }
}