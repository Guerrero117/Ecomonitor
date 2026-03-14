import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Añadimos ReactiveFormsModule
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true, // Importante si usas Angular 17+
  imports: [ReactiveFormsModule], // Agregamos esto para que reconozca el formulario
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService // Inyectamos el servicio
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required], // Cambié 'name' a 'nombre' para que coincida con tu modelo de .NET
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  register() {
  
     console.log("Valores actuales:", this.registerForm.value);
     console.log("¿Es válido?:", this.registerForm.valid);
     console.log("Errores:", this.registerForm.errors);

    

    if (this.registerForm.invalid) {
      alert("Completa todos los campos correctamente");
      return;
    }

    const data = this.registerForm.value;

    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // --- AQUÍ CONECTAMOS CON EL BACKEND ---
    // Eliminamos 'confirmPassword' antes de enviar porque el backend no lo necesita
    const { confirmPassword, ...userData } = data;

    this.authService.register(userData).subscribe({
      next: (response) => {
        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
        this.router.navigate(['/']); // Te manda al login
      },
      error: (err) => {
        console.error(err);
        alert("Error al registrar: " + (err.error?.message || "Servidor no disponible"));
      }
    });
  }

  goLogin() {
    this.router.navigate(['/']);
  }
}