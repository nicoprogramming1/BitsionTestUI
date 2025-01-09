import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    title: 'Inicio de sesión',
    path: 'login',
    loadComponent: () =>
      import('./views/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    title: 'Registro de usuarios',
    path: 'register-user',
    loadComponent: () =>
      import('./views/auth/register/register-user.component').then(
        (m) => m.RegisterUserComponent
      ),
    canActivate: [authGuard],
  },
  {
    title: 'Consulta de cliente',
    path: 'client/:id',
    loadComponent: () =>
      import('./views/clients/client/client.component').then((m) => m.ClientComponent),
    canActivate: [authGuard],
  },
  {
    title: 'Registro de clientes',
    path: 'register',
    loadComponent: () =>
      import('./views/clients/register/register-client.component').then(
        (m) => m.RegisterClientComponent
      ),
    canActivate: [authGuard],
  },
  {
    title: 'Clientes',
    path: 'list',
    loadComponent: () =>
      import('./views/clients/list/list.component').then((m) => m.ListComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
