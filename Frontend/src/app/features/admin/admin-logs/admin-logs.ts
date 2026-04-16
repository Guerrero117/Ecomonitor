import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface LogEntry {
  id: string;
  usuarioId: string;
  accion: string;
  detalle: string;
  ip: string;
  fecha: string;
}

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-logs.html',
  styleUrl: './admin-logs.css'
})
export class AdminLogsComponent implements OnInit {
  logs: LogEntry[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarLogs();
  }

  cargarLogs() {
    this.http.get<LogEntry[]>(`${environment.apiUrl}/admin/auditoria`).subscribe({
      next: (data) => {
        this.logs = data;
      },
      error: (err) => {
        console.error('Error cargando los logs de auditoría:', err);
      }
    });
  }
}