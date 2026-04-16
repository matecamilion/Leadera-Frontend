import { Routes } from '@angular/router';
import { NuevaInteraccion } from './pages/nueva-interaccion/nueva-interaccion';
import { Home } from './pages/home/home';
import { ListadoLeadsComponent } from './pages/listar-leads/listar-leads';
import { DetalleLead } from './pages/detalle-lead/detalle-lead';
import { GestionarBusquedaComponent } from './pages/gestionar-busqueda/gestionar-busqueda';
import { GestionDelDia } from './pages/gestion-del-dia/gestion-del-dia';
import { NuevoLead } from './pages/nuevo-lead/nuevo-lead';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';

export const routes: Routes = [
    // 1. Rutas de Autenticación (Públicas)
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // 2. Rutas de Negocio (Protegidas)
  { path: 'home', component: Home }, 
  { path: 'leads', component: ListadoLeadsComponent },
  { path: 'leads/nuevo', component: NuevoLead },
  { path: 'leads/:id', component: DetalleLead },
  { 
    path: 'leads/:id/busqueda', 
    component: GestionarBusquedaComponent,
    title: 'LeadEra - Gestionar Búsqueda' 
  },
  { path: 'gestion-del-dia', component: GestionDelDia },
  { path: 'leads/:id/interaccion', component: NuevaInteraccion },

  // 3. Redirecciones y Comodines
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } // Si escriben cualquier cosa, al login
  

];
