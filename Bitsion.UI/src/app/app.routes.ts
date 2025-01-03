import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    title: 'Inicio de sesión',
    path: 'login',
    loadComponent: () =>
      import('./views/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    title: 'Registro de usuarios',
    path: 'register',
    loadComponent: () =>
      import('./views/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    canActivate: [authGuard],
    data: { menu: {  role: 'admin' } }, // sólo es visible para el admin
  },
  {
    title: 'Registro de clientes',
    path: 'register',
    loadComponent: () =>
      import('./views/clients/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    canActivate: [authGuard],
  },
  {
    title: 'Clientes',
    path: 'list',
    loadComponent: () =>
      import('./views/clients/list/list.component').then(
        (m) => m.ListComponent
      ),
    canActivate: [authGuard],
  },
  {
    title: 'Consulta de cliente',
    path: 'client',
    loadComponent: () =>
      import('./views/clients/client/client.component').then(
        (m) => m.ClientComponent
      ),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
];
