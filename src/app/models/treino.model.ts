import { Modalidade } from "../shared/enums/modalidade";
import { Conta } from "./conta.model";
import { DataHorario } from "./dataHorario";

export interface Treino{
codigo?: number;
nome: string;
descricao: string;
alunos: Conta[];
criador?: Conta;
datasTreinos: DataHorario[];
dataVencimento?: Date;
modalidade: Modalidade;
limiteAlunos: number;
}
