import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TreinoService } from '../../services/treino/treino.service';
import { Treino } from '../../models/treino.model';
import { DiasSemana } from '../../shared/enums/diasSemana';

@Component({
  selector: 'app-home-aluno',
  imports: [CommonModule, FormsModule],
  templateUrl: './home-aluno.component.html',
  styleUrl: './home-aluno.component.css'
})
export class HomeAlunoComponent implements OnInit {
  treinos: Treino[] = [];
  treinosFiltrados: Treino[] = [];
  filtro = '';
  isLoading = signal(true);
  erro = signal<string | null>(null);

  constructor(private treinoService: TreinoService, private router: Router) {}

  ngOnInit(): void {
    this.treinoService.getTreinosAluno().subscribe({
      next: (treinos) => {
        this.treinos = treinos;
        this.treinosFiltrados = treinos;
        this.isLoading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar treinos. Tente novamente.');
        this.isLoading.set(false);
      }
    });
  }

  filtrar(): void {
    const f = this.filtro.toLowerCase();
    this.treinosFiltrados = this.treinos.filter(t =>
      t.nome.toLowerCase().includes(f) || t.modalidade?.toLowerCase().includes(f)
    );
  }

  getNomeDia(dia: number): string {
    return Object.values(DiasSemana)[dia];
  }

  buscarCTs(): void {
    this.router.navigate(['/buscar-cts']);
  }
}
