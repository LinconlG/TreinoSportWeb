import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CriarTreinoComponent } from '../components/modals/criar-treino/criar-treino.component';
import { Observable } from 'rxjs';
import { Treino } from '../models/treino.model';
import { Modalidade } from '../shared/enums/modalidade';
import { ListaPresencaComponent } from '../components/modals/lista-presenca/lista-presenca.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  abrirModalCriarTreino(modalidadesCriadas: Modalidade[]): Observable<Treino> {
    return this.dialog.open(CriarTreinoComponent, {
      width: '60vw',
      maxWidth: '60vw',
      height: '80vh',
      disableClose: true, // Desabilita o fechamento ao clicar fora do modal
      autoFocus: false, // Desabilita o foco automático no primeiro campo
      restoreFocus: true, // Restaura o foco corretamente
      data: modalidadesCriadas
    }).afterClosed();
  }

  abrirModalListaPresenca(codigoTreino: number, dia: number, codigoHorario: number) {
    return this.dialog.open(ListaPresencaComponent, {
      width: '30vw',
      maxWidth: '30vw',
      height: '40vh',
      disableClose: true, // Desabilita o fechamento ao clicar fora do modal
      autoFocus: false, // Desabilita o foco automático no primeiro campo
      restoreFocus: true, // Restaura o foco corretamente
      data: { codigoTreino, dia, codigoHorario}
    }).afterClosed();
  }
}


