import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/components/login/login.component';
import {PaginaUsuarioComponent} from './features/usuario/components/pagina-usuario/pagina-usuario.component';
import {TiendaComponent} from './features/tienda/pages/tienda/tienda.component';
import {DetallesComponent} from './features/detalles_libro/pages/detalles/detalles.component';
import {AuthGuard} from './core/guards/auth.guard';
import {RegistroComponent} from './features/registro/componentes/registro/registro.component';
import {CarritoComponent} from './features/carrito/carrito.component';
import {InicioComponent} from './features/inicio/pages/inicio/inicio.component';
import {PasarelaPagoComponent} from './shared/components/pasarela-pago/pasarela-pago.component';
import {ActivacionComponent} from './features/registro/componentes/activacion/activacion.component';
import {AdminComponent} from './features/admin/admin.component';

export const routes: Routes = [
  {path : '', redirectTo: '/main', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'usuario', component: PaginaUsuarioComponent, canActivate:[AuthGuard]},
  { path: 'detallelibro/:id', component: DetallesComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'carrito', component: CarritoComponent, canActivate:[AuthGuard]},
  { path: 'main', component: InicioComponent },
  { path: 'pago', component: PasarelaPagoComponent},
  { path: 'activar/:token', component: ActivacionComponent },
  { path: 'admin', component: AdminComponent }
];
