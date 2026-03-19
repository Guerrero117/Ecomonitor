import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({ ... })
export class RecoveryComponent {
  userEmail: string = '';
  constructor(private router: Router) {}

  enviar() {
    // Aquí iría la lógica para conectar con tu backend
    // Después de la lógica, rediriges a la página de confirmación:
    this.router.navigate(['/correo-enviado']);
  }
}