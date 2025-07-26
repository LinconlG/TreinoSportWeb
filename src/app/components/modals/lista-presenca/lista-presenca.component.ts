import { Component, Inject } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreinoService } from 'src/app/services/treino/treino.service';
import { Conta } from 'src/app/models/conta.model';

@Component({
  selector: 'app-lista-presenca',
  imports: [],
  templateUrl: './lista-presenca.component.html',
  styleUrl: './lista-presenca.component.css'
})
export class ListaPresencaComponent {

  alunosPresentes: Array<Conta>;

  constructor(@Inject(MAT_DIALOG_DATA) public  data: { codigoTreino: number; dia: number; codigoHorario: number }, private treinoService: TreinoService, private overlayContainer: OverlayContainer, private dialogRef: MatDialogRef<ListaPresencaComponent>){}

  ngOnInit(){
    console.log(this.data.codigoTreino, this.data.dia, this.data.codigoHorario);
    this.treinoService.getTreinoPresentes(this.data.codigoTreino, this.data.dia, this.data.codigoHorario).subscribe({
          next: (contas) => {
            console.log(contas);
            this.alunosPresentes = contas;
          },
          error: (error) => {
            console.log(error);
          }
    });
  }

  fechar() {
    const overlayContainer = this.overlayContainer.getContainerElement();
    overlayContainer.innerHTML = '';
    this.dialogRef.close(false)
  }
}
