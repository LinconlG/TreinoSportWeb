import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreinoService } from 'src/app/services/treino/treino.service';
import { Conta } from 'src/app/models/conta.model';
import { DataHorario } from 'src/app/models/dataHorario';
import { UserStateService } from 'src/app/services/user-state.service';

@Component({
  selector: 'app-lista-presenca',
  imports: [CommonModule],
  templateUrl: './lista-presenca.component.html',
  styleUrl: './lista-presenca.component.css'
})
export class ListaPresencaComponent implements OnInit {

  alunosPresentes: Array<Conta> = [];
  todosAlunos: Array<Conta> = [];
  isCT = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      codigoTreino: number;
      dia: number;
      codigoHorario: number;
      datasTreinos: DataHorario[];
    },
    private treinoService: TreinoService,
    private overlayContainer: OverlayContainer,
    private dialogRef: MatDialogRef<ListaPresencaComponent>,
    private userState: UserStateService
  ) {}

  ngOnInit() {
    this.isCT = this.userState.getUserType() === 'CT';
    this.treinoService.getTreinoPresentes(this.data.codigoTreino, this.data.dia, this.data.codigoHorario).subscribe({
      next: (contas) => {
        this.alunosPresentes = contas;
      },
      error: (error) => {
        console.error(error);
      }
    });

    if (this.isCT) {
      this.treinoService.getTreinoAlunos(this.data.codigoTreino).subscribe({
        next: (alunos) => {
          this.todosAlunos = alunos;
        },
        error: (e) => console.error(e)
      });
    }
  }

  get alunosAusentes(): Conta[] {
    const presentesCodigos = new Set(this.alunosPresentes.map(a => a.codigo));
    return this.todosAlunos.filter(a => !presentesCodigos.has(a.codigo));
  }

  adicionarPresenca(aluno: Conta): void {
    this.treinoService.marcarPresenca(
      this.data.codigoTreino,
      aluno.codigo!,
      this.data.dia,
      this.data.codigoHorario,
      this.data.datasTreinos ?? []
    ).subscribe({
      next: () => {
        this.alunosPresentes = [...this.alunosPresentes, aluno];
      },
      error: (e) => console.error(e)
    });
  }

  removerPresenca(aluno: Conta): void {
    this.treinoService.removerPresenca(
      this.data.codigoTreino,
      aluno.codigo!,
      this.data.dia,
      this.data.codigoHorario,
      this.data.datasTreinos ?? []
    ).subscribe({
      next: () => {
        this.alunosPresentes = this.alunosPresentes.filter(a => a.codigo !== aluno.codigo);
      },
      error: (e) => console.error(e)
    });
  }

  fechar() {
    const overlayContainer = this.overlayContainer.getContainerElement();
    overlayContainer.innerHTML = '';
    this.dialogRef.close(false);
  }
}
