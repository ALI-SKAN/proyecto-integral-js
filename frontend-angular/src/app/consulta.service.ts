// Servicio que centraliza TODAS las llamadas HTTP a la API
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsultaEstudiante } from './consulta.model';

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  // Base de la API REST (mismo origen/puerto que el servidor unificado)
  private api = '/api/consultas';

  constructor(private http: HttpClient) {}

  // Listar todas las consultas
  listar(): Observable<ConsultaEstudiante[]> {
    return this.http.get<ConsultaEstudiante[]>(this.api);
  }

  // Actualizar una consulta existente (función de esta app: editar)
  actualizar(id: number, datos: Partial<ConsultaEstudiante>): Observable<ConsultaEstudiante> {
    return this.http.put<ConsultaEstudiante>(`${this.api}/${id}`, datos);
  }
}
