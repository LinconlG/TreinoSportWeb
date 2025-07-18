import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Modalidade } from '../../../shared/enums/modalidade';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { DiasSemana } from 'src/app/shared/enums/diasSemana';
import { DataHorario } from 'src/app/models/dataHorario';
import { Horario } from 'src/app/models/horario';
import { Treino } from 'src/app/models/treino.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-criar-treino',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './criar-treino.component.html',
  styleUrl: './criar-treino.component.css'
})
export class CriarTreinoComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public modalidadesCriadas: Modalidade[], private snackBar: MatSnackBar, private dialogRef: MatDialogRef<CriarTreinoComponent>, private overlayContainer: OverlayContainer) { }

  horaSelecionada: string;

  modalidades = Object.values(Modalidade);
  selectedModalidade: Modalidade | null = null;
  modalidadesRestantes: Modalidade[];
  modalidadeSelecionadoControl = new FormControl< Modalidade | null>(null);
  descricaoControl = new FormControl< string | null>(null);
  limiteControl = new FormControl< number | null>(null);

  ngOnInit(): void {
    this.modalidadesRestantes = this.modalidades.filter(
      m => !this.modalidadesCriadas.includes(m)
    );
  }

  getNomeModalidade(modalidade: Modalidade): string {
    const nomes = {
      [Modalidade.BeachTennis]: 'Beach Tennis',
      [Modalidade.Danca]: 'Dança',
      [Modalidade.Funcional]: 'Funcional',
      [Modalidade.Futebol]: 'Futebol',
      [Modalidade.Futsal]: 'Futsal',
      [Modalidade.Futevolei]: 'Futevôlei',
      [Modalidade.Ginastica]: 'Ginástica',
      [Modalidade.JiuJitsu]: 'Jiu Jitsu',
      [Modalidade.MuaiThai]: 'Muay Thai',
      [Modalidade.Natacao]: 'Natação',
      [Modalidade.Pilates]: 'Pilates',
      [Modalidade.Tenis]: 'Tênis',
      [Modalidade.Volei]: 'Vôlei'
    };
    return nomes[modalidade];
  }
  // Lógica para dias da semana ------------------
  diasOrdenados: Array<{ numero: number, nome: DiasSemana }> = [
    { numero: 0, nome: DiasSemana.DOMINGO },
    { numero: 1, nome: DiasSemana.SEGUNDA },
    { numero: 2, nome: DiasSemana.TERCA },
    { numero: 3, nome: DiasSemana.QUARTA },
    { numero: 4, nome: DiasSemana.QUINTA },
    { numero: 5, nome: DiasSemana.SEXTA },
    { numero: 6, nome: DiasSemana.SABADO }
  ]
  diasDisponiveis = signal(this.diasOrdenados.map(dia => dia));

  diasSelecionados = signal<{ numero:number, dataHorario:DataHorario }[]>([]);

  diaSelecionadoControl = new FormControl<{numero:number, nome: string} | null>(null);

  adicionarDia(){
    const diaSelecionado = this.diaSelecionadoControl.value;

    if(diaSelecionado){

      const novaDataHorario: DataHorario = {
        diaExibicao: diaSelecionado.nome,
        dia: diaSelecionado.numero,
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

  previnirPropagation(event: Event){
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  removerDia(diaRemovido: string, event?: Event) {
    try {
      this.previnirPropagation(event);
      var diaRemovidoObj = this.diasOrdenados.find(dia => dia.nome === diaRemovido);
      this.diasSelecionados.update(dias => dias.filter(dia => dia.numero !== diaRemovidoObj.numero));
      this.diasDisponiveis.update(dias => [...dias, diaRemovidoObj].sort((a, b) => a.numero - b.numero));
    } catch (e) {
      console.error('Erro interno na modal:', e);
      this.snackBar.open('Erro interno. Tente novamente.', 'Fechar', { duration: 3000 });
    }
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

  onClickRemoverHorario(data: DataHorario, event: Event){
    this.previnirPropagation(event)
    data.horarios.pop();
  }
  //--------------------------------------------------------------

  // Lógica para criação do treino ou fechar modal------------------


  criarTreino() {

    const treino: Treino = {
        nome: this.getNomeModalidade(this.modalidadeSelecionadoControl.value),
        descricao: this.descricaoControl.value,
        alunos: [],
        datasTreinos: this.diasSelecionados().map(item => item.dataHorario),
        modalidade: this.modalidadeSelecionadoControl.value,
        limiteAlunos: this.limiteControl.value
    }

    const overlayContainer = this.overlayContainer.getContainerElement();
    overlayContainer.innerHTML = '';
    this.dialogRef.close(treino)
  }

  fechar() {
    const overlayContainer = this.overlayContainer.getContainerElement();
    overlayContainer.innerHTML = '';
    this.dialogRef.close(false)
  }

}
