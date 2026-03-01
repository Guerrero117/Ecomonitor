import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule], // Agregamos CommonModule por si usas directivas como *ngIf o *ngFor
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // Aquí puedes añadir la lógica de autenticación más adelante
  constructor() {}
}