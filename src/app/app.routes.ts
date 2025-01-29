import { Routes } from '@angular/router';
import { TiendaComponent } from './features/tienda/pages/tienda/tienda.component';
import { LoginComponent } from './features/login/components/login/login.component';
import {PaginaUsuarioComponent} from './features/usuario/components/pagina-usuario/pagina-usuario.component';

export const routes: Routes = [
  { path: '', component: TiendaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: TiendaComponent },
  { path: 'usuario', component: PaginaUsuarioComponent },
];
