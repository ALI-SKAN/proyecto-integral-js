// Componente de detalle: muestra la consulta seleccionada
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaEstudiante } from './consulta.model';

@Component({
  selector: 'app-consulta-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card detail-card" *ngIf="consulta">
      <div class="detail-header">
        <h3>Detalle #{{ consulta.id }}</h3>
        <span [ngClass]="'badge badge-' + consulta.estado.replace(' ', '-')">{{ consulta.estado }}</span>
      </div>
      <dl class="detail-list">
        <div><dt>Estudiante</dt><dd>{{ consulta.estudiante }}</dd></div>
        <div><dt>Asunto</dt><dd>{{ consulta.asunto }}</dd></div>
        <div><dt>Mensaje</dt><dd>{{ consulta.mensaje }}</dd></div>
        <div><dt>Fecha</dt><dd>{{ consulta.fecha | date: 'medium' }}</dd></div>
      </dl>
    </div>
  `
})
export class ConsultaDetailComponent {
  // Consulta a mostrar (la recibe del componente padre)
  @Input() consulta: ConsultaEstudiante | null = null;
}
