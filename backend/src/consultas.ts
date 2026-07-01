// Lógica CRUD (controlador + almacén en memoria). Sin base de datos para
// mantener el proyecto ligero; los datos viven mientras el servidor esté activo.
import type { ConsultaEstudiante, ConsultaInput } from './types';

let consultas: ConsultaEstudiante[] = [
  { id: 1, estudiante: 'Ana Torres', asunto: 'Matrícula', mensaje: '¿Cuándo abre la matrícula del próximo ciclo?', estado: 'pendiente', fecha: new Date().toISOString() },
  { id: 2, estudiante: 'Luis Pérez', asunto: 'Notas', mensaje: 'No veo mi nota del examen final.', estado: 'en proceso', fecha: new Date().toISOString() },
];
let siguienteId = 3;

export const listar = (): ConsultaEstudiante[] => consultas;

export const obtener = (id: number): ConsultaEstudiante | undefined =>
  consultas.find((c) => c.id === id);

export const crear = (datos: ConsultaInput): ConsultaEstudiante => {
  const nueva: ConsultaEstudiante = { id: siguienteId++, fecha: new Date().toISOString(), ...datos };
  consultas.push(nueva);
  return nueva;
};

export const actualizar = (id: number, datos: Partial<ConsultaInput>): ConsultaEstudiante | undefined => {
  const consulta = obtener(id);
  if (!consulta) return undefined;
  Object.assign(consulta, datos);
  return consulta;
};

export const eliminar = (id: number): boolean => {
  const antes = consultas.length;
  consultas = consultas.filter((c) => c.id !== id);
  return consultas.length < antes;
};
