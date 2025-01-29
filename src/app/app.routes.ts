import { Routes } from '@angular/router';
import {TiendaComponent} from './features/tienda/pages/tienda/tienda.component';
import {DetallesComponent} from './features/detalles_libro/pages/detalles/detalles.component';

export const routes: Routes = [
  { path: '', component: TiendaComponent},
  { path: 'detallelibro/:id', component: DetallesComponent}
];
