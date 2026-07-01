// Funcion EDITAR: lista las consultas y permite actualizar la elegida (PUT)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultaEstudiante, EstadoConsulta } from './consulta.model';
import { ConsultaService } from './consulta.service';
import { ConsultaDetailComponent } from './consulta-detail.component';

@Component({
  selector: 'app-consulta-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConsultaDetailComponent],
  template: `
    <!-- Cabecera -->
    <header class="hero">
      <h1>✏️ Editar Consultas</h1>
      <p>Selecciona una consulta y actualiza sus datos</p>
    </header>

    <main class="container">
      <!-- Formulario de edicion (solo visible al editar) -->
      <section class="card" *ngIf="editando">
        <h2 class="card-title">✏️ Editar consulta #{{ idEditando }}</h2>
        <div class="form-grid">
          <div class="field">
            <label>Estudiante</label>
            <input placeholder="Nombre del estudiante" [(ngModel)]="form.estudiante" />
          </div>
          <div class="field">
            <label>Asunto</label>
            <input placeholder="Asunto de la consulta" [(ngModel)]="form.asunto" />
          </div>
          <div class="field field-full">
            <label>Mensaje</label>
            <textarea placeholder="Describe la consulta..." [(ngModel)]="form.mensaje"></textarea>
          </div>
          <div class="field">
            <label>Estado</label>
            <select [(ngModel)]="form.estado">
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En proceso</option>
              <option value="resuelta">Resuelta</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" (click)="guardar()">Actualizar</button>
          <button class="btn btn-ghost" (click)="cancelar()">Cancelar</button>
        </div>
      </section>

      <!-- Encabezado del listado -->
      <div class="list-header">
        <h2>Listado</h2>
        <span class="count">{{ consultas.length }} consulta(s)</span>
      </div>

      <!-- Rejilla de consultas -->
      <div class="grid" *ngIf="consultas.length > 0; else vacio">
        <article class="card consulta-card" *ngFor="let c of consultas">
          <div class="consulta-top">
            <span class="avatar">{{ c.estudiante.charAt(0).toUpperCase() }}</span>
            <div class="consulta-info">
              <strong>{{ c.estudiante }}</strong>
              <span class="asunto">{{ c.asunto }}</span>
            </div>
            <span [ngClass]="'badge badge-' + c.estado.replace(' ', '-')">{{ c.estado }}</span>
          </div>
          <p class="mensaje">{{ c.mensaje }}</p>
          <div class="consulta-actions">
            <button class="btn btn-sm btn-ghost" (click)="ver(c)">Ver</button>
            <button class="btn btn-sm btn-outline" (click)="editar(c)">Editar</button>
          </div>
        </article>
      </div>

      <!-- Estado vacío -->
      <ng-template #vacio>
        <div class="empty">
          <span class="empty-icon">📭</span>
          <p>No hay consultas registradas todavía.</p>
        </div>
      </ng-template>

      <!-- Detalle de la consulta seleccionada -->
      <app-consulta-detail [consulta]="seleccionada"></app-consulta-detail>
    </main>
  `
})
export class ConsultaListComponent implements OnInit {
  consultas: ConsultaEstudiante[] = [];
  seleccionada: ConsultaEstudiante | null = null;
  editando = false;
  idEditando: number | null = null;

  // Modelo del formulario de edicion
  form: Partial<ConsultaEstudiante> = { estado: 'pendiente' as EstadoConsulta };

  constructor(private servicio: ConsultaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  // Cargar el listado desde la API
  cargar(): void {
    this.servicio.listar().subscribe(data => (this.consultas = data));
  }

  // Cargar una consulta en el formulario para editar
  editar(c: ConsultaEstudiante): void {
    this.editando = true;
    this.idEditando = c.id;
    this.form = { estudiante: c.estudiante, asunto: c.asunto, mensaje: c.mensaje, estado: c.estado };
  }

  // Guardar los cambios con PUT (actualizar)
  guardar(): void {
    if (this.idEditando == null) return;
    this.servicio.actualizar(this.idEditando, this.form).subscribe(() => {
      this.cancelar();
      this.cargar();
    });
  }

  // Cancelar la edicion
  cancelar(): void {
    this.editando = false;
    this.idEditando = null;
    this.form = { estado: 'pendiente' as EstadoConsulta };
  }

  // Mostrar el detalle
  ver(c: ConsultaEstudiante): void {
    this.seleccionada = c;
  }
}
