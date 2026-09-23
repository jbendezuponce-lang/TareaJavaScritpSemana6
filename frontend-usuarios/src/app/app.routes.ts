import { Routes } from '@angular/router';
import { UserList } from './pages/user-list/user-list';
import { UserForm } from './pages/user-form/user-form';

export const routes: Routes = [
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
  { path: 'usuarios', component: UserList, title: 'Usuarios' },
  { path: 'usuarios/nuevo', component: UserForm, title: 'Nuevo usuario' },
  { path: 'usuarios/:id/editar', component: UserForm, title: 'Editar usuario' },
  { path: '**', redirectTo: 'usuarios' },
];
