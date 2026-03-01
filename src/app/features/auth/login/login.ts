import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  // Importamos lo necesario para que el formulario funcione
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // Variables para guardar lo que el usuario escribe
  email = '';
  password = '';

  constructor(private router: Router) {}

  // Esta función se ejecuta cuando el usuario presiona el botón de entrar
  login() {
    // Por ahora, simulamos que el acceso es correcto y saltamos al dashboard
    console.log('Usuario intentando entrar:', this.email);
    this.router.navigate(['/dashboard']);
  }
}