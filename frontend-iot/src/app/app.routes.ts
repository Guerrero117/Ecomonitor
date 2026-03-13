import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard'; 
import { AlertasComponent } from './features/alertas/alertas';
import { GruposComponent } from './features/grupos/grupos';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './features/register/register';


// 1. IMPORTACIÓN CRÍTICA: 
// El error dice que no lo encuentra porque en tu carpeta dice 'sensors' (plural) 
// y el archivo se llama 'sensor-list' (con guion). 
// La ruta debe incluir la carpeta 'sensors' que está antes de 'sensor-list'
import { SensorListComponent } from './features/sensors/sensor-list/sensor-list';
import { LoginComponent } from './features/auth/login/login';
export const routes: Routes = [

  {
    path: 'register',
    component: RegisterComponent
  },
 {
    path: 'login',
    component: LoginComponent
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      /* --- RUTAS ANIDADAS --- */
      // Estas se inyectan en el <router-outlet> del dashboard
      { path: 'alertas', component: AlertasComponent },
      { path: 'grupos', component: GruposComponent },
      
      // 2. RUTA DE DISPOSITIVOS:
      // Aquí es donde vinculamos la URL con el componente que jala datos de Mongo
      { path: 'devices', component: SensorListComponent }
    ]
  },
  
  // Si la URL está vacía, te manda al dashboard por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Si el usuario escribe cualquier otra cosa, lo redirigimos al inicio
  { path: '**', redirectTo: 'login' } 

];

