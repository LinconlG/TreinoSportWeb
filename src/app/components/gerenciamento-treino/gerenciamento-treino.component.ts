import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerenciamento-treino',
  imports: [],
  templateUrl: './gerenciamento-treino.component.html',
  styleUrl: './gerenciamento-treino.component.css'
})
export class GerenciamentoTreinoComponent {
  codigoTreino: number
  constructor(private router:Router){
    try{
      const nav = this.router.getCurrentNavigation();
      this.codigoTreino = nav.extras.state?.['data'];
      console.log(this.codigoTreino);
    } catch{
      this.router.navigate(['/home/ct']);
    }
  }


}
