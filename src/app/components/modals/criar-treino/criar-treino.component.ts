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
import { DataHorario } from 'src/app/models/dataHorario';
import { Horario } from 'src/app/models/horario';
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
  selectedModalidade: Modalidade | null = null;
  horaSelecionada: string;

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
  // Lógica para dias da semana ------------------
  diasOrdenados: Array<{ numero: number, nome: DiasSemana }> = [
    { numero: 1, nome: DiasSemana.SEGUNDA },
    { numero: 2, nome: DiasSemana.TERCA },
    { numero: 3, nome: DiasSemana.QUARTA },
    { numero: 4, nome: DiasSemana.QUINTA },
    { numero: 5, nome: DiasSemana.SEXTA },
    { numero: 6, nome: DiasSemana.SABADO },
    { numero: 7, nome: DiasSemana.DOMINGO }
  ]
  diasDisponiveis = signal(this.diasOrdenados.map(dia => dia));

  diasSelecionados = signal<{ numero:number, dataHorario:DataHorario }[]>([]);

  diaSelecionadoControl = new FormControl<{numero:number, nome:DiasSemana} | null>(null);

  adicionarDia(){
    const diaSelecionado = this.diaSelecionadoControl.value;

    if(diaSelecionado){

      const novaDataHorario: DataHorario = {
        dia: diaSelecionado.nome,
        horarios: []
      };
      const selecionado = {
        numero: diaSelecionado.numero,
        dataHorario: novaDataHorario
      }

      this.diasSelecionados.update(dias => [...dias, selecionado]);

      this.diasDisponiveis.update(dias => dias.filter(dia => dia.numero !== diaSelecionado.numero));
    }

    this.diaSelecionadoControl.reset();
  }

  removerDia(diaRemovido: string) {
    var diaRemovidoObj = this.diasOrdenados.find(dia => dia.nome === diaRemovido);
    this.diasSelecionados.update(dias => dias.filter(dia => dia.numero !== diaRemovidoObj.numero));
    this.diasDisponiveis.update(dias => [...dias, diaRemovidoObj].sort((a, b) => a.numero - b.numero));

  }

  onTimeChange(event: Event, data: DataHorario) {
    const input = event.target as HTMLInputElement;
    const horaString = input.value; // Formato "HH:MM"
    console.log('Hora selecionada:', horaString);

    // Converter string para Date
    const [hours, minutes] = horaString.split(':').map(Number);
    const horaDate = new Date();
    horaDate.setHours(hours, minutes, 0, 0); // Configura apenas hora e minuto

    const horario: Horario = {
      codigo: data.horarios.length + 1,
      hora: horaDate,
      alunosPresentes: []
    };

    data.horarios.push(horario)
  }

  onClickRemoverHorario(data: DataHorario){
    data.horarios.pop();
  }
  //--------------------------------------------------------------

  //fazer model de dataTreino? para adicionar a lista de horarios

  // Lógica para criação do treino ou fechar modal------------------
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
