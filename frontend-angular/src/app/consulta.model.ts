// Modelo de datos de una consulta estudiantil

// Estados posibles de una consulta
export type EstadoConsulta = 'pendiente' | 'en proceso' | 'resuelta';

// Interfaz principal del modelo
export interface ConsultaEstudiante {
  id: number;
  estudiante: string;
  asunto: string;
  mensaje: string;
  estado: EstadoConsulta;
  fecha: string; // fecha en formato ISO
}
