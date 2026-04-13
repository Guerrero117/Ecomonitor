import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-password.html',
  styleUrls: ['./new-password.css']
})
export class NewPasswordComponent {
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  guardarPassword() {
    const pass = this.password.trim();
    const confirm = this.confirmPassword.trim();

    // Validar campos vacíos
    if (!pass || !confirm) {
      alert('Llena todos los campos');
      return;
    }

    // Validar longitud mínima
    if (pass.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Validar coincidencia
    if (pass !== confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // 🚀 Redirigir al login
    alert('Contraseña actualizada correctamente');
    this.router.navigate(['/login']);
  }
}