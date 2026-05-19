import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpParams } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-esqueci-senha',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './esqueci-senha.component.html',
  styleUrl: './esqueci-senha.component.scss'
})
export class EsqueciSenhaComponent {
  currentStep = 1;
  carregando = false;
  codigoConta: number | null = null;
  tokenInserido: string | null = null;

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.step1Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.step2Form = this.fb.group({
      token: ['', Validators.required]
    });
    this.step3Form = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    });
  }

  enviarEmail(): void {
    if (this.step1Form.invalid || this.carregando) return;
    this.carregando = true;
    const params = new HttpParams().set('email', this.step1Form.value.email);
    this.api.put<number>('usuario/senha/envio', null, params).subscribe({
      next: (codigoConta) => {
        this.codigoConta = codigoConta;
        this.currentStep = 2;
        this.carregando = false;
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erro ao enviar email.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        this.carregando = false;
      }
    });
  }

  verificarToken(): void {
    if (this.step2Form.invalid || this.carregando) return;
    this.carregando = true;
    const token = this.step2Form.value.token;
    const params = new HttpParams()
      .set('codigoConta', this.codigoConta!)
      .set('tokenInserido', token);
    this.api.get<void>('usuario/token', params).subscribe({
      next: () => {
        this.tokenInserido = token;
        this.currentStep = 3;
        this.carregando = false;
      },
      error: (err) => {
        const msg = err?.error?.message || 'Token inválido ou expirado.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        this.carregando = false;
      }
    });
  }

  redefinirSenha(): void {
    if (this.step3Form.invalid || this.carregando) return;
    const { novaSenha, confirmarSenha } = this.step3Form.value;
    if (novaSenha !== confirmarSenha) {
      this.snackBar.open('As senhas não coincidem.', 'Fechar', { duration: 3000 });
      return;
    }
    this.carregando = true;
    const params = new HttpParams()
      .set('codigoConta', this.codigoConta!)
      .set('novaSenha', novaSenha)
      .set('tokenInserido', this.tokenInserido!);
    this.api.put<void>('usuario/senha/redefinir', null, params).subscribe({
      next: () => {
        this.snackBar.open('Senha redefinida com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erro ao redefinir senha.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        this.carregando = false;
      }
    });
  }
}
