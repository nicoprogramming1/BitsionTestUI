import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';

export const routes: Routes = [
  
  {
    path: 'login',
    component: LoginComponent,
  },
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
