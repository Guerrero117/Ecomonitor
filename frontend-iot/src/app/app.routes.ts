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
import { AdminLogsComponent } from './features/admin/admin-logs/admin-logs';
import { RPasswordComponent } from './features/r-password/r-password'; 
import { VerifyCodeComponent } from './features/verify-code/verify-code';
import { NewPasswordComponent } from './features/new-password/new-password';
import { AdminLogsIotComponent } from './features/admin/admin-logs-iot/admin-logs-iot';

// --- GUARDS ---
import { authGuard } from './core/guards/auth-guard';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth';
import { Router } from '@angular/router';

const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.getRol() === 'admin' ? true : router.parseUrl('/dashboard');
};

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'r-password', component: RPasswordComponent },
  { path: 'verify-code', component: VerifyCodeComponent },
  { path: 'new-password', component: NewPasswordComponent },
  
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
      
      // RUTAS DE ADMIN (Dentro de Dashboard para que no te saque al login)
      { path: 'admin-users', component: AdminUsersComponent, canActivate: [adminGuard] },
      { path: 'admin-logs', component: AdminLogsComponent, canActivate: [adminGuard] },
      { path: 'admin-logs-iot', component: AdminLogsIotComponent, canActivate: [adminGuard] }, // <-- AGREGADA AQUÍ
      
      { path: '', redirectTo: 'devices', pathMatch: 'full' }
    ]
  },

  // Redirecciones globales
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];