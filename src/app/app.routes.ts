import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import { DeviceListComponent } from './features/devices/device-list/device-list';
import { SensorListComponent } from './features/sensors/sensor-list/sensor-list';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'devices', component: DeviceListComponent },
  { path: 'sensors', component: SensorListComponent },
];