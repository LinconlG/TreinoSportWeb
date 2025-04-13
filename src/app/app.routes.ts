import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { CadastroComponent } from './cadastro/cadastro.component';
import { HomeCtComponent } from './home-ct/home-ct.component';
import { HomeAlunoComponent } from './home-aluno/home-aluno.component';
import { LateralMenuComponent } from './lateral-menu/lateral-menu.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Redireciona imediatamente para login
    pathMatch: 'full'
  },
  {
    path: '', component: LateralMenuComponent, canActivate: [AuthGuard], children: [
      { path: 'home/ct', component: HomeCtComponent },
      { path: 'home/aluno', component: HomeAlunoComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent }
];
