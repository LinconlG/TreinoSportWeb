import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CriarTreinoComponent } from '../components/modals/criar-treino/criar-treino.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  abrirModalCriarTreino() {
    return this.dialog.open(CriarTreinoComponent, {
      width: '60vw',
      maxWidth: '60vw',
      height: '80vh',
      disableClose: true, // Desabilita o fechamento ao clicar fora do modal
      autoFocus: false, // Desabilita o foco automático no primeiro campo
      restoreFocus: true // Restaura o foco corretamente
    }).afterClosed();
  }
}


