import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/components/login/login.component';
import {PaginaUsuarioComponent} from './features/usuario/components/pagina-usuario/pagina-usuario.component';
import {TiendaComponent} from './features/tienda/pages/tienda/tienda.component';
import {DetallesComponent} from './features/detalles_libro/pages/detalles/detalles.component';

export const routes: Routes = [
  { path: '', component: TiendaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: TiendaComponent },
  { path: 'usuario', component: PaginaUsuarioComponent },
  { path: 'detallelibro/:id', component: DetallesComponent}
];
