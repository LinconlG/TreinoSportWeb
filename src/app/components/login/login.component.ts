import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
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
  private jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar, private userState: UserStateService) {}

  login(){
    this.authService.login(this.usuario, this.senha).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        var tipo = this.getUserType() as "CT" | "Aluno";
        this.userState.setUserType(tipo);
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

  getTokenClaims(): any {
    const token = this.authService.getToken();
    if (!token) return null;

    try {
      var claims = this.jwtHelper.decodeToken(token);
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getUserType(): string | null {
    const claims = this.getTokenClaims();
  if (claims.role) {
    return claims.role as string;
  }

    return null;
  }
}
