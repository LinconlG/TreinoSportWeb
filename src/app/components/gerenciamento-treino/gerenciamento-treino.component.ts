import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TreinoService } from 'src/app/services/treino/treino.service';
import { DataHorario } from 'src/app/models/dataHorario';
import { DiasSemana } from 'src/app/shared/enums/diasSemana';
import { DialogService } from 'src/app/services/dialog.service';
import { Conta } from 'src/app/models/conta.model';
import { Treino } from 'src/app/models/treino.model';
import { FormControl, ReactiveFormsModule  } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gerenciamento-treino',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gerenciamento-treino.component.html',
  styleUrl: './gerenciamento-treino.component.css'
})
export class GerenciamentoTreinoComponent {
  codigoTreino: number
  diasTreinos: DataHorario[];
  alunos: Conta[];
  emailAluno = new FormControl<string | null>(null);

  constructor(private router:Router, private treinoService:TreinoService, private dialogService:DialogService, private snackBar: MatSnackBar){
    try{
      const nav = this.router.getCurrentNavigation();
      this.codigoTreino = nav.extras.state?.['data'];
      console.log(this.codigoTreino);
    } catch{
      this.router.navigate(['/home/ct']);
    }
  }

  getNomeDia(dia: number): string {
    return Object.values(DiasSemana)[dia];
  }

  ngOnInit(){
    this.buscarDias(this.codigoTreino);
    this.buscarAlunos(this.codigoTreino);
  }

  buscarDias(codigoTreino: number){
    this.treinoService.getTreinoGerenciamento(codigoTreino).subscribe({
          next: (treino) => {
            this.diasTreinos = treino.datasTreinos;
          },
          error: (error) => {
            console.log(error);
          }
    });
  }

  buscarAlunos(codigoTreino: number){
    this.treinoService.getTreinoAlunos(codigoTreino).subscribe({
          next: (contas) => {
            this.alunos = contas;
          },
          error: (error) => {
            console.log(error);
          }
    });
  }

  adicionarAluno(email: string | null){
    if(email == null){
      console.log("email null");
      return;
    }
    this.treinoService.putTreinoAluno(this.codigoTreino, email).subscribe({
          next: () => {
            this.buscarAlunos(this.codigoTreino);
            this.emailAluno.reset();
          },
          error: (error) => {
            console.log(error);
          }
    });
  }

  abrirListaPresenca(dia: number, codigoHorario: number){
        this.dialogService.abrirModalListaPresenca(this.codigoTreino, dia, codigoHorario, this.diasTreinos).subscribe({
          next: () => {

          },
          error: (error) => {
            console.log(error);
          }
        });
  }

  deletarTreino(){
    this.dialogService.abrirConfirmacao("Tem certeza que deseja DELETAR este treino?")
    .subscribe(result => {
      if (result){
        this.treinoService.deleteTreino(this.codigoTreino).subscribe({
          next: () => {
            this.router.navigate(['/home/ct']);
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    });
  }

  editarTreino(): void {
    this.treinoService.getTreinoGerenciamento(this.codigoTreino).subscribe({
      next: (treino) => {
        this.dialogService.abrirEditarTreino(treino).subscribe({
          next: (result) => {
            if (result) {
              this.treinoService.atualizarTreino(result as Treino).subscribe({
                next: () => this.buscarDias(this.codigoTreino),
                error: (e) => console.error(e)
              });
            }
          }
        });
      }
    });
  }

  atualizarHorarios(): void {
    this.treinoService.atualizarHorarios(this.codigoTreino, this.diasTreinos).subscribe({
      next: () => this.buscarDias(this.codigoTreino),
      error: (e) => console.error(e)
    });
  }

  removerAluno(codigoConta: number): void {
    this.dialogService.abrirConfirmacao('Tem certeza que deseja remover este aluno?')
      .subscribe(result => {
        if (result) {
          this.treinoService.removerAluno(this.codigoTreino, codigoConta).subscribe({
            next: () => {
              this.buscarAlunos(this.codigoTreino);
              this.snackBar.open('Aluno removido com sucesso!', 'Fechar', { duration: 3000 });
            },
            error: (error) => {
              console.error(error);
              this.snackBar.open('Erro ao remover aluno.', 'Fechar', { duration: 3000 });
            }
          });
        }
      });
  }
}

