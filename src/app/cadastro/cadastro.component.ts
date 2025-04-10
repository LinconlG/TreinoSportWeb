import { Component, signal } from '@angular/core';
import { Conta } from '../models/conta.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  conta: Conta = {
    codigo: 0,
    nome: '',
    email: '',
    senha: '',
    descricao: '',
    IsCentroTreinamento: false
  }

  carregando = signal(false);
  erro = signal<string | null>(null);

  form: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      mostrarInput: [false],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      descricao: [''],
      IsCentroTreinamento: [false]
    });

    this.form.get('mostrarInput')?.valueChanges.subscribe(value => {
      this.conta.IsCentroTreinamento = value;
    });

    this.form.get('mostrarInput')?.valueChanges.subscribe(mostrar => {//caso o valor do checkbox mude
      const campo = this.form.get('campoAdicional');
      if (mostrar) {
        campo?.enable(); // Habilita o campo
        campo?.setValidators([Validators.required]); // Torna obrigatório
      } else {
        campo?.disable(); // Desabilita o campo
        campo?.clearValidators(); // Remove validação
        campo?.reset(); // Limpa o valor
      }
      campo?.updateValueAndValidity(); // Atualiza estado de validação
    });

  }

  cadastrar(){
    if (this.carregando()) return; // Evita múltiplos submits

    this.carregando.set(true);
    this.erro.set(null);

    this.conta.nome = this.form.get('nome')?.value;
    this.conta.email = this.form.get('email')?.value;
    this.conta.senha = this.form.get('senha')?.value;
    this.conta.descricao = this.form.get('descricao')?.value;
    this.conta.IsCentroTreinamento = this.form.get('IsCentroTreinamento')?.value;

    this.usuarioService.cadastrar(this.conta).subscribe({
      next: (response) => {
        this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.erro.set(this.formatarErro(error));
        this.snackBar.open('Erro no cadastro: ' + this.erro(), 'Fechar', {
          duration: 5000
        });
      }, complete: () => {
        this.carregando.set(false);
      }
    });
  }

  private formatarErro(error: any): string {
    // Implementação simples para formatar o erro
    return error?.message || 'Ocorreu um erro desconhecido.';
  }

}
