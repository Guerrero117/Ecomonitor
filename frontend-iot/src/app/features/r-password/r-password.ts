import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-r-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './r-password.html',
  styleUrls: ['./r-password.css']
})
export class RPasswordComponent {
  correo: string = '';

  constructor(private router: Router) {}

  enviarRecuperacion() {
    const correoLimpio = this.correo.trim();

    // Validación: campo vacío
    if (!correoLimpio) {
      alert('Ingresa tu correo electrónico');
      return;
    }

    // Validación: formato básico de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correoLimpio)) {
      alert('Ingresa un correo válido');
      return;
    }

    // 🚀 Redirección a verify-code
    this.router.navigate(['/verify-code'], {
      queryParams: { email: correoLimpio }
    });
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }
}