import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStateService } from '../../services/user-state.service';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  isCT = false;
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private userState: UserStateService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: [''],
      email: [''],
      descricao: [''],
      senha: [''],
      senhaAtual: ['']
    });
  }

  ngOnInit(): void {
    const claims = this.userState.getTokenClaims();
    if (claims) {
      this.isCT = claims.role === 'CT';
      this.form.patchValue({
        nome: claims.Nome ?? claims.nome ?? '',
        email: claims.email ?? claims.Email ?? '',
        descricao: claims.Descricao ?? claims.descricao ?? ''
      });
    }
  }

  salvar(): void {
    if (this.carregando) return;
    this.carregando = true;

    const payload: any = {
      nome: this.form.value.nome,
      email: this.form.value.email,
      senhaAtual: this.form.value.senhaAtual || undefined
    };

    if (this.isCT) {
      payload.descricao = this.form.value.descricao;
    }

    if (this.form.value.senha) {
      payload.senha = this.form.value.senha;
    }

    this.usuarioService.atualizarConta(payload).subscribe({
      next: () => {
        this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.carregando = false;
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erro ao atualizar perfil.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        this.carregando = false;
      }
    });
  }
}
