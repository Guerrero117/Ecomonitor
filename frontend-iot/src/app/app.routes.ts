import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard'; 
import { AlertasComponent } from './features/alertas/alertas';
import { GruposComponent } from './features/grupos/grupos';
import { RegisterComponent } from './features/register/register';
import { SensorListComponent } from './features/sensors/sensor-list/sensor-list';
import { LoginComponent } from './features/auth/login/login';
import { EntradaManualComponent } from './features/entrada-manual/entrada-manual'; 
import { ClimaComparativoComponent } from './features/clima-comparativo/clima-comparativo';
import { AdminUsersComponent } from './features/admin/admin-users/admin-users';

// --- GUARDS ---
import { authGuard } from './core/guards/auth-guard';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth';
import { Router } from '@angular/router';

// Guard para proteger la zona de Admin
const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.getRol() === 'admin' ? true : router.parseUrl('/dashboard');
};

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard], 
    children: [
      { path: 'alertas', component: AlertasComponent },
      { path: 'grupos', component: GruposComponent },
      { path: 'devices', component: SensorListComponent },
      { path: 'entrada-manual', component: EntradaManualComponent },
      { path: 'clima-comparativo', component: ClimaComparativoComponent },
      // RUTA DE ADMIN
      { path: 'admin-users', component: AdminUsersComponent, canActivate: [adminGuard] },
      { path: '', redirectTo: 'devices', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } 
];