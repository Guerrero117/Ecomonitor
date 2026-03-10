import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard'; 
import { AlertasComponent } from './features/alertas/alertas';
import { GruposComponent } from './features/grupos/grupos';

export const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      // 🟢 Estas son las rutas que se verán DENTRO del router-outlet del dashboard
      { path: 'alertas', component: AlertasComponent },
      { path: 'grupos', component: GruposComponent },
      // Si quieres que al entrar a /dashboard se vea algo por defecto, puedes dejarlo así o crear un InicioComponent
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' } // Por si escribes mal la URL
];