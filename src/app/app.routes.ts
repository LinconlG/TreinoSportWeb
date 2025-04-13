import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { CadastroComponent } from './cadastro/cadastro.component';
import { HomeCtComponent } from './home-ct/home-ct.component';
import { HomeAlunoComponent } from './home-aluno/home-aluno.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'home/ct', component: HomeCtComponent, canActivate: [AuthGuard] },
  { path: 'home/aluno', component: HomeAlunoComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
