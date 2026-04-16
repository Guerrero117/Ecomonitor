import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Ajusta si tu archivo se llama auth.ts

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos si es admin usando el método que ya tienes en el auth.ts
  if (authService.getRol() === 'admin') {
    return true; // Pasa, es admin
  }

  // Si no es admin, lo mandamos al dashboard normal
  console.warn('Acceso denegado: Se requiere rol de administrador');
  router.navigate(['/dashboard']);
  return false;
};