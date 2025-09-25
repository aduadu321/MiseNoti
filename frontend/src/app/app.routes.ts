import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./components/auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'auth/github/callback', loadComponent: () => import('./components/auth/github-callback/github-callback').then(m => m.GitHubCallbackComponent) },
  { path: 'forgot-password', loadComponent: () => import('./components/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'programare', loadComponent: () => import('./components/programare/programare').then(m => m.ProgramareComponent) },
  { path: 'servicii', loadComponent: () => import('./components/servicii/servicii').then(m => m.ServiciiComponent) },
  { path: 'teste', loadComponent: () => import('./components/teste/teste').then(m => m.TesteComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact').then(m => m.ContactComponent) },
  { path: 'users', loadComponent: () => import('./components/users/users').then(m => m.Users) },
  { path: 'dashboard', loadComponent: () => import('./components/users/users').then(m => m.Users) },
  { path: '**', redirectTo: '/home' }
];
