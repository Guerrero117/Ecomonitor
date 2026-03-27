import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface UsuarioDetalle {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  // CAMBIO: Estos nombres deben coincidir EXACTAMENTE con el JSON del backend
  registro: Date; 
  totalGrupos: number;
  totalSensores: number; 
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html', 
  styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent implements OnInit {
  usuarios: UsuarioDetalle[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.error = '';

    this.http.get<UsuarioDetalle[]>(`${environment.apiUrl}/admin/usuarios-detallados`).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de autorización: No tienes permisos de administrador.';
        this.loading = false;
        console.error('Error en el Panel Admin:', err);
      }
    });
  }
}