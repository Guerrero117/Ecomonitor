import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // Declaramos las variables que el HTML está buscando
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

    goDashboard(){
    this.router.navigate(['/dashboard']);
  }

  goRegister(){
    this.router.navigate(['/register']);
  }


  // El HTML busca una función llamada login()
  login() {
    console.log("Iniciando sesión con:", this.email);
    
    // Simulación de entrada exitosa a EcoMonitor
    if (this.email && this.password) {
      this.router.navigate(['/dashboard']);
    } else {
      alert("Por favor, llena todos los campos");
    }
  }
}