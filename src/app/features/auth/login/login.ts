import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; 

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

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    if (!this.email || !this.password) {
      alert("Por favor, llena todos los campos");
      return;
    }

    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (res: any) => {
        // 1. Guardamos el objeto usuario para la UI
        localStorage.setItem('usuario', JSON.stringify(res)); 
        
        // 2. Guardamos el TOKEN CRÍTICO para el Interceptor
        localStorage.setItem('token', res.token); 
        
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        alert(err.error?.message || "Credenciales incorrectas");
      }
    });
  }
  goRegister() {
    this.router.navigate(['/register']);
  }
}