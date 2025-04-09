import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

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

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  login(){
    this.authService.login(this.usuario, this.senha).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/home'])
      },
      error: (error) => {
        this.snackBar.open('Usuário ou senha inválidos', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });
  }

  cadastrar(){
    //alterar para a tela
  }
}
