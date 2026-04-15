import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

// Definimos la interfaz aquí mismo para evitar el error de importación
interface ComponentLogEntry {
  id?: string;
  fechaHora: string;
  nombreComponente: string;
  idComponente: string;
  nombreUsuario: string;
}

@Component({
  selector: 'app-admin-logs-iot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-logs-iot.html',
  styleUrls: ['./admin-logs-iot.css']
})
export class AdminLogsIotComponent implements OnInit {
  
  public logs: ComponentLogEntry[] = [];
  public isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarLogsDeAuditoria();
  }

  cargarLogsDeAuditoria(): void {
    this.isLoading = true;
    // Asegúrate de que esta ruta coincida con tu API en C# / Node
    this.http.get<ComponentLogEntry[]>(`${environment.apiUrl}/admin/auditoria-componentes`).subscribe({
      next: (data) => {
        this.logs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al conectar con la base de datos:', err);
        this.isLoading = false;
        // Opcional: Cargar datos de prueba si falla la API para no ver la tabla vacía
        this.logs = []; 
      }
    });
  }
}