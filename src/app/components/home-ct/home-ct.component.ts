import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Treino } from 'src/app/models/treino.model';
import { TreinoService } from 'src/app/services/treino/treino.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Modalidade } from 'src/app/shared/enums/modalidade';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-ct',
  imports: [CommonModule],
  templateUrl: './home-ct.component.html',
  styleUrl: './home-ct.component.css'
})


export class HomeCtComponent implements OnInit {
  treinos: Treino[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  constructor(private treinoService: TreinoService, private dialogService: DialogService, private snackBar: MatSnackBar, private router: Router) {}
  modalidadesCriadas: Modalidade[] = [];

  ngOnInit(): void {
    this.carregarTreinos();// Quando o componente inicia, carrega os treinos
  }

  carregarTreinos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.treinoService.getTreinos().subscribe({
      next: (treinos) => {
        this.treinos = treinos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar treinos:', error);
        this.errorMessage = 'Erro ao carregar treinos. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }

  criarTreino(): void {
    this.modalidadesCriadas = this.treinos.map(treino => treino.modalidade);
    this.dialogService.abrirModalCriarTreino(this.modalidadesCriadas).subscribe({
      next: (treino: Treino) => {
        if (treino) {
          this.requisicaoCriarTreino(treino);
        }
      },
      error: (error) => {
        this.onErro(error); // Chama o método de erro
      }
    });
  }

  requisicaoCriarTreino(treino: Treino){
    this.treinoService.createTreino(treino).subscribe({
        next: () => {
          this.carregarTreinos();
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('Erro' + `${error}`, 'Fechar', {
            duration: 1000,
            verticalPosition: 'top'
          });
        }
      });
  }

  private onErro(erro: any) {
    console.error('Erro no modal:', erro);
    this.snackBar.open('Erro ao criar treino', 'Fechar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  gerenciarTreino(codigoTreino: number){
    console.log(`clicou! ${codigoTreino}`)
    this.router.navigate(['/gerenciamento/treino'], {
      state: { data: codigoTreino  }
    });
  }

}
