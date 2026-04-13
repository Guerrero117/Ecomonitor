import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './verify-code.html',
  styleUrls: ['./verify-code.css']
})
export class VerifyCodeComponent {
  codigo: string = '';

  constructor(private router: Router) {}

  validarCodigo() {
    const codigoLimpio = this.codigo.trim();

    if (!codigoLimpio) {
      alert('Ingresa el código');
      return;
    }

    if (codigoLimpio.length !== 6) {
      alert('El código debe tener 6 dígitos');
      return;
    }

    this.router.navigate(['/new-password']);
  }

  volverRecuperacion() {
    this.router.navigate(['/r-password']);
  }
}