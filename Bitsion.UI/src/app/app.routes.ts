import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    title: 'Inicio de sesión',
    path: 'login',
    loadComponent: () =>
      import('./views/auth/login/login.component').then((m) => m.LoginComponent),
  },
  // solo accesible para admin
  {
    title: 'Registro de usuarios',
    path: 'register-user',
    loadComponent: () =>
      import('./views/auth/register/register-user.component').then(
        (m) => m.RegisterUserComponent
      ),
    canActivate: [authGuard],
    data: { menu: { role: 'admin' } },
  },
  // Rutas para el CRUD de Clientes
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'list',
        title: 'Clientes',
        loadComponent: () =>
          import('./views/clients/list/list.component').then((m) => m.ListComponent),
      },
      {
        path: 'client/:id',
        title: 'Consulta de cliente',
        loadComponent: () =>
          import('./views/clients/client/client.component').then((m) => m.ClientComponent),
      },
      {
        path: 'register',
        title: 'Registro de cliente',
        loadComponent: () =>
          import('./views/clients/register/register-client.component').then(
            (m) => m.RegisterClientComponent
          ),
      },
    ],
  },
  // acá redireccionamos la ruta por defecto al listado de clientes
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // esta momentaneamente redirigiendo al login
  { path: '**', redirectTo: 'login' }, // redirige cualquier ruta no encontrada al login
];
