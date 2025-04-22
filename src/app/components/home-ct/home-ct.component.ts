import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Treino } from 'src/app/models/treino.model';
import { TreinoService } from 'src/app/services/treino/treino.service';

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

  constructor(private treinoService: TreinoService) {}

  ngOnInit(): void {
    this.carregarTreinos();// Quando o componente inicia, carrega os treinos
  }

  private carregarTreinos(): void {
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
}
