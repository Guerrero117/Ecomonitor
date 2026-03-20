import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard'; 
import { AlertasComponent } from './features/alertas/alertas';
import { GruposComponent } from './features/grupos/grupos';
import { RegisterComponent } from './features/register/register';
import { SensorListComponent } from './features/sensors/sensor-list/sensor-list';
import { LoginComponent } from './features/auth/login/login';
import { EntradaManualComponent } from './features/entrada-manual/entrada-manual'; 
import { ClimaComparativoComponent } from './features/clima-comparativo/clima-comparativo';

// --- IMPORTAR EL GUARD ---
import { authGuard } from './core/guards/auth-guard';
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
    canActivate: [authGuard], // <--- BLOQUEO TOTAL: Si no hay login, no entra a nada del dashboard
    children: [
      { path: 'alertas', component: AlertasComponent },
      { path: 'grupos', component: GruposComponent },
      { path: 'devices', component: SensorListComponent },
      { path: 'entrada-manual', component: EntradaManualComponent },
      { path: 'clima-comparativo', component: ClimaComparativoComponent },
      { path: '', redirectTo: 'devices', pathMatch: 'full' }
    ]
  },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } 
];