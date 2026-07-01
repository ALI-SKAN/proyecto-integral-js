// Componente raiz: barra de navegacion comun + funcion Editar (lista de consultas)
import { Component } from '@angular/core';
import { ConsultaListComponent } from './consulta-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConsultaListComponent],
  template: `
    <!-- Barra de navegacion comun a las 4 funciones -->
    <nav class="topnav">
      <span class="brand">Consultas</span>
      <div class="links">
        <a href="/registrar">Registrar</a>
        <a href="/editar" class="active">Editar</a>
        <a href="/filtrar">Filtrar</a>
        <a href="/estado">Estado</a>
      </div>
    </nav>

    <!-- Funcion Editar/Actualizar -->
    <app-consulta-list></app-consulta-list>
  `
})
export class AppComponent {}
