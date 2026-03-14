import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; // Importamos el servicio

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService // Inyectamos el servicio
  ) {}

  login() {
    if (!this.email || !this.password) {
      alert("Por favor, llena todos los campos");
      return;
    }

    const credentials = {
      email: this.email,
      password: this.password
    };

    // Llamamos al backend
    this.authService.login(credentials).subscribe({
      next: (res: any) => {
        console.log("Login exitoso", res);
        
        // Guardamos el nombre o el token para usarlo en el dashboard
        localStorage.setItem('usuario', res.nombre || 'Usuario');
        
        // Si tu backend regresa un token (JWT), guárdalo así:
        // localStorage.setItem('token', res.token);

        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error(err);
        // El error puede ser porque el correo no existe o la contraseña está mal
        alert(err.error?.message || "Correo o contraseña incorrectos");
      }
    });
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}