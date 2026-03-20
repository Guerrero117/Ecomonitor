import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificamos si hay token (el "pasaporte")
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    return true; // Adelante, puedes pasar
  } else {
    // No hay token, te mando al login
    router.navigate(['/login']);
    return false;
  }
};