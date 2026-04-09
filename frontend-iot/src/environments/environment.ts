export const environment = {
  production: false,
  // Detecta la IP actual automáticamente para el API en el puerto 5126
  apiUrl: `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5126/api` 
};