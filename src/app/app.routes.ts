import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import { DeviceListComponent } from './features/devices/device-list/device-list';
import { SensorListComponent } from './features/sensors/sensor-list/sensor-list';
import { RecoveryComponent } from './BasedeDatos/RecoveryComponent/recovery.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'devices', component: DeviceListComponent },
  { path: 'sensors', component: SensorListComponent },
  { path: 'recuperar-password', component: RecoveryComponent },
  { path: 'correo-enviado', component : SuccessComponent },
];