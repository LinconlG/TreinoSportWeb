import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { HomeCtComponent } from './components/home-ct/home-ct.component';
import { HomeAlunoComponent } from './components/home-aluno/home-aluno.component';
import { LateralMenuComponent } from './components/lateral-menu/lateral-menu.component';
import { GerenciamentoTreinoComponent } from './components/gerenciamento-treino/gerenciamento-treino.component';
import { BuscarCtsComponent } from './components/buscar-cts/buscar-cts.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { EsqueciSenhaComponent } from './components/esqueci-senha/esqueci-senha.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Redireciona imediatamente para login
    pathMatch: 'full'
  },
  {
    path: '', component: LateralMenuComponent, canActivate: [AuthGuard], children: [
      { path: 'home/ct', component: HomeCtComponent },
      { path: 'home/aluno', component: HomeAlunoComponent },
      { path: 'gerenciamento/treino', component: GerenciamentoTreinoComponent },
      { path: 'buscar-cts', component: BuscarCtsComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'esqueci-senha', component: EsqueciSenhaComponent }
];
