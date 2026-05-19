import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Treino } from "../../models/treino.model";
import { Conta } from "src/app/models/conta.model";
import { DataHorario } from "src/app/models/dataHorario";
import { ApiService } from "../api.service";
import { UserStateService } from "../user-state.service";

@Injectable({
  providedIn: "root"
})

export class TreinoService {

  constructor(private api: ApiService, private userState: UserStateService) {}

  getTreinos(): Observable<Treino[]> {
    return this.api.get<Treino[]>('treino/ct/todos');
  }

  getTreino(id: number): Observable<Treino> {
    return this.api.get<Treino>(`treino/${id}`);
  }

  getTreinoGerenciamento(codigoTreino: number): Observable<Treino> {
    const params = new HttpParams().set('codigoTreino', codigoTreino);
    return this.api.get<Treino>('treino/gerenciamento/especifico', params);
  }

  getTreinoPresentes(codigoTreino: number, dia: number, codigoHorario: number): Observable<Conta[]> {
    const params = new HttpParams()
      .set('codigoTreino', codigoTreino)
      .set('codigoDia', dia)
      .set('codigoHorario', codigoHorario);
    return this.api.get<Conta[]>('treino/presentes', params);
  }

  getTreinoAlunos(codigoTreino: number): Observable<Conta[]> {
    const params = new HttpParams()
      .set('codigoTreino', codigoTreino);
    return this.api.get<Conta[]>('treino/alunos', params);
  }

  putTreinoAluno(codigoTreino: number, email: string): Observable<void> {
    const params = new HttpParams()
      .set('codigoTreino', codigoTreino)
      .set('emailAluno', email);
    return this.api.put<void>('treino/alunos', null, params);
  }

  createTreino(treino: Treino): Observable<void> {
    return this.api.put<void>('treino/ct/criar', treino);
  }

  deleteTreino(codigoTreino: number): Observable<void> {
    const params = new HttpParams()
      .set('codigoTreino', codigoTreino);
    return this.api.delete<void>('treino/ct/detalhes', params);
  }

  // Task 8.1: pass codigoUsuario from JWT claims
  getTreinosAluno(): Observable<Treino[]> {
    const claims = this.userState.getTokenClaims();
    const params = new HttpParams().set('codigoUsuario', claims?.CodigoConta ?? 0);
    return this.api.get<Treino[]>('treino/aluno/todos', params);
  }

  atualizarTreino(treino: Treino): Observable<void> {
    return this.api.patch<void>('treino/ct/detalhes', treino);
  }

  // Task 8.3: codigoTreino as query param, datasTreinos as body
  atualizarHorarios(codigoTreino: number, datasTreinos: DataHorario[]): Observable<void> {
    const params = new HttpParams().set('codigoTreino', codigoTreino);
    return this.api.patch<void>('treino/ct/horarios', datasTreinos, params);
  }

  // Task 8.2: use codigoAluno (number) and send datasTreinos as body
  marcarPresenca(codigoTreino: number, codigoAluno: number, codigoDia: number, codigoHorario: number, datasTreinos: DataHorario[]): Observable<void> {
    const params = new HttpParams()
      .set('codigoTreino', codigoTreino)
      .set('codigoAluno', codigoAluno)
      .set('codigoDia', codigoDia)
      .set('codigoHorario', codigoHorario);
    return this.api.patch<void>('treino/aluno/presenca/marcar', datasTreinos, params);
  }

  removerPresenca(codigoTreino: number, codigoAluno: number, codigoDia: number, codigoHorario: number, datasTreinos: DataHorario[]): Observable<void> {
    const params = new HttpParams()
      .set('codigoTreino', codigoTreino)
      .set('codigoAluno', codigoAluno)
      .set('codigoDia', codigoDia)
      .set('codigoHorario', codigoHorario);
    return this.api.patch<void>('treino/aluno/presenca/remover', datasTreinos, params);
  }

  removerAluno(codigoTreino: number, codigoConta: number): Observable<void> {
    const params = new HttpParams()
      .set('codigoTreino', codigoTreino)
      .set('codigoConta', codigoConta);
    return this.api.delete<void>('treino/alunos', params);
  }
}
