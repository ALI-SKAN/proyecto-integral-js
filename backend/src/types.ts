// Modelo de datos compartido por toda la API (Etapa 2: tipado con TypeScript).

export type EstadoConsulta = 'pendiente' | 'en proceso' | 'resuelta';

export interface ConsultaEstudiante {
  id: number;
  estudiante: string;
  asunto: string;
  mensaje: string;
  estado: EstadoConsulta;
  fecha: string; // ISO 8601
}

// Datos que envía el cliente al crear/editar (el id y la fecha se generan en el servidor).
export type ConsultaInput = Omit<ConsultaEstudiante, 'id' | 'fecha'>;
