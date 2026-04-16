export const environment = {
  production: false,
  // Detecta automáticamente la IP de la laptop de tu compañero
  apiUrl: `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5126/api` 
};