import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. FILTRO DE EXCEPCIÓN
  // Verificamos si la URL es para el clima (vía proxy o directa)
  const esClima = req.url.includes('api.openweathermap.org') || req.url.includes('/weather-api');

 if (esClima) {
  // Clonamos la petición eliminando el header Authorization por completo
  const climaReq = req.clone({
    headers: req.headers.delete('Authorization').set('Accept', 'application/json')
  });
  return next(climaReq);
}

  // 2. SEGURIDAD DE TU PROPIA APP (ECO MONITOR)
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? localStorage.getItem('token') : null;

  if (token) {
    // Solo si es para TUS sensores o TUS datos, inyectamos el token
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Si no hay token (ejemplo: estás en la pantalla de Login), pasa normal
  return next(req);
};