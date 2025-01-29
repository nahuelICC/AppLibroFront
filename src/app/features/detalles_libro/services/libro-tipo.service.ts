import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibroTipoService {
  private apiUrl = 'http://localhost:8000/api/libroTipo';

  constructor(private http: HttpClient) {}



}
