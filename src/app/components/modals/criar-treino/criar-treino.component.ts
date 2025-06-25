import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { timer } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Modalidade } from '../../../shared/enums/modalidade';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-criar-treino',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './criar-treino.component.html',
  styleUrl: './criar-treino.component.css'
})
export class CriarTreinoComponent {
  form: FormGroup;
  Modalidade = Modalidade;
  modalidades = Object.values(Modalidade);
  diasDisponiveis = signal<string[]>([
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ]);

  diasSelecionados = signal<string[]>([]);
  diaSelecionadoControl = new FormControl<string | null>(null);
  selectedModalidade: Modalidade | null = null;

  getNomeModalidade(modalidade: Modalidade): string {
    const nomes = {
      [Modalidade.BEACHTENNIS]: 'Beach Tennis',
      [Modalidade.DANCA]: 'Dança',
      [Modalidade.FUNCIONAL]: 'Funcional',
      [Modalidade.FUTEBOL]: 'Futebol',
      [Modalidade.FUTSAL]: 'Futsal',
      [Modalidade.FUTVOLEI]: 'Futvôlei',
      [Modalidade.GINASTICA]: 'Ginástica',
      [Modalidade.JIUJITSU]: 'Jiu Jitsu',
      [Modalidade.MUAITHAI]: 'Muay Thai',
      [Modalidade.NATAÇÃO]: 'Natação',
      [Modalidade.PILATES]: 'Pilates',
      [Modalidade.TENIS]: 'Tênis',
      [Modalidade.VOLEI]: 'Vôlei'
    };
    return nomes[modalidade] || modalidade;
  }

  getNomeDiasSemana(diaSemana: string): string {
    const nomes = {
      'Segunda-feira': 'Segunda-feira',
      'Terça-feira': 'Terça-feira',
      'Quarta-feira': 'Quarta-feira',
      'Quinta-feira': 'Quinta-feira',
      'Sexta-feira': 'Sexta-feira',
      'Sábado': 'Sábado',
      'Domingo': 'Domingo'
    };
    return nomes[diaSemana] || diaSemana;
  }

  getNomeDia(dia: string): string {
    return dia;
  }

  adicionarDia(){
    const diaSelecionado = this.diaSelecionadoControl.value;

    if(diaSelecionado){
      this.diasSelecionados.update(dias => [...dias, diaSelecionado]);

      this.diasDisponiveis.update(dias => dias.filter(dia => dia !== diaSelecionado));
    }

    this.diaSelecionadoControl.reset();
  }

  removerDia(diaRemovido: string) {

    this.diasSelecionados.update(dias => dias.filter(dia => dia !== diaRemovido));
    this.diasDisponiveis.update(dias => [...dias, diaRemovido]);

  }

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CriarTreinoComponent>, private overlayContainer: OverlayContainer) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      dataInicio: ['', Validators.required],
    });
  }

  criarTreino() {
    if(this.form.valid) {
      const treino = this.form.value;
      // Aqui você pode fazer o que quiser com os dados do treino, como enviar para um serviço ou API
      console.log('Treino criado:', treino);
      this.fechar();
    }
  }

  fechar() {
    const overlayContainer = this.overlayContainer.getContainerElement();
    overlayContainer.innerHTML = '';
    this.dialogRef.close(false)
  }

}
