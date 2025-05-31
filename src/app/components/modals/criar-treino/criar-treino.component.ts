import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { timer } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Modalidade } from '../../../shared/enums/modalidade';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-criar-treino',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './criar-treino.component.html',
  styleUrl: './criar-treino.component.css'
})
export class CriarTreinoComponent {
  form: FormGroup;
  Modalidade = Modalidade;
  modalidades = Object.values(Modalidade);
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
