import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard'; 
import { AlertasComponent } from './features/alertas/alertas';
import { GruposComponent } from './features/grupos/grupos';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './features/register/register';
import { SensorListComponent } from './features/sensors/sensor-list/sensor-list';
import { LoginComponent } from './features/auth/login/login';

// --- NUEVAS IMPORTACIONES ---
import { EntradaManualComponent } from './features/entrada-manual/entrada-manual'; 
import { ClimaComparativoComponent } from './features/clima-comparativo/clima-comparativo';

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
      /* --- RUTAS ANIDADAS EXISTENTES --- */
      { path: 'alertas', component: AlertasComponent },
      { path: 'grupos', component: GruposComponent },
      { path: 'devices', component: SensorListComponent },

      /* --- NUEVAS RUTAS PARA EL EQUIPO --- */
      // Estas se verán dentro del dashboard
      { path: 'entrada-manual', component: EntradaManualComponent },
      { path: 'clima-comparativo', component: ClimaComparativoComponent },

      // Ruta por defecto dentro del dashboard (opcional)
      { path: '', redirectTo: 'devices', pathMatch: 'full' }
    ]
  },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } 
];