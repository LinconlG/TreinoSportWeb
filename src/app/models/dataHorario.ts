import { DiasSemana } from "../shared/enums/diasSemana";
import { Horario } from "./horario";

export interface DataHorario{
  dia: DiasSemana;
  horarios: Horario[]
}
