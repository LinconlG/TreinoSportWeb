import { DiasSemana } from "../shared/enums/diasSemana";
import { Horario } from "./horario";

export interface DataHorario{
  diaExibicao: string;
  dia: number;
  horarios: Horario[]
}
