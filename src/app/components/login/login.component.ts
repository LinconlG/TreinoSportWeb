import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';

import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario: string = '';
  senha: string = '';


  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar, private userState: UserStateService) {
    this.authService.setToken('');
  }

  login(){
    this.authService.login(this.usuario, this.senha).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.userState.setUserType();
        var tipo = this.userState.userType();
        if(tipo == 'CT'){
          this.router.navigate(['/home/ct'])
        } else if (tipo == 'Aluno') {
          this.router.navigate(['/home/aluno']);
        }
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open('Usuário ou senha inválidos', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });
  }

  cadastrarTela(){
    this.router.navigate(['/cadastro'])
  }


}
