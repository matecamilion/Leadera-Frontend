import { Interaccion } from './interaccion';
import { Busqueda } from './busqueda';

export interface Lead {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  estado: string;
  tipoLead?: string;

  fechaEntrada?: string;
  ultimoContacto?: string | null;

  interacciones?: Interaccion[];
  busqueda?: Busqueda | null;
}