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
import { DiasSemana } from 'src/app/shared/enums/diasSemana';
import { D } from 'node_modules/@angular/common/common_module.d-Qx8B6pmN';
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
  diasOrdenados = [
    { numero: 1, nome: DiasSemana.SEGUNDA },
    { numero: 2, nome: DiasSemana.TERCA },
    { numero: 3, nome: DiasSemana.QUARTA },
    { numero: 4, nome: DiasSemana.QUINTA },
    { numero: 5, nome: DiasSemana.SEXTA },
    { numero: 6, nome: DiasSemana.SABADO },
    { numero: 7, nome: DiasSemana.DOMINGO }
  ]
  diasDisponiveis = signal(this.diasOrdenados.map(dia => dia));

  diasSelecionados = signal<{ numero:number, nome:string }[]>([]);

  diaSelecionadoControl = new FormControl<{numero:number, nome:string} | null>(null);
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

  adicionarDia(){
    const diaSelecionado = this.diaSelecionadoControl.value;

    if(diaSelecionado){
      this.diasSelecionados.update(dias => [...dias, diaSelecionado]);

      this.diasDisponiveis.update(dias => dias.filter(dia => dia.numero !== diaSelecionado.numero));
    }

    this.diaSelecionadoControl.reset();
  }

  removerDia(diaRemovido: string) {
    var diaRemovidoObj = this.diasOrdenados.find(dia => dia.nome === diaRemovido);
    this.diasSelecionados.update(dias => dias.filter(dia => dia.numero !== diaRemovidoObj.numero));
    this.diasDisponiveis.update(dias => [...dias, diaRemovidoObj].sort((a, b) => a.numero - b.numero));

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
