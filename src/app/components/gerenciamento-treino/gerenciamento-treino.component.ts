import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TreinoService } from 'src/app/services/treino/treino.service';
import { DataHorario } from 'src/app/models/dataHorario';
import { DiasSemana } from 'src/app/shared/enums/diasSemana';
import { DialogService } from 'src/app/services/dialog.service';
import { Conta } from 'src/app/models/conta.model';
import { FormControl, ReactiveFormsModule  } from '@angular/forms';

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

  constructor(private router:Router, private treinoService:TreinoService, private dialogService:DialogService){
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
        this.dialogService.abrirModalListaPresenca(this.codigoTreino, dia, codigoHorario).subscribe({
          next: () => {

          },
          error: (error) => {
            console.log(error);
          }
        });
  }


}
