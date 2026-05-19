import { Component, signal } from '@angular/core';
import { Conta } from '../../models/conta.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario/usuario.service';
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
    isCentroTreinamento: false
  }

  carregando = signal(false);
  erro = signal<string | null>(null);

  form: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      descricao: [''],
      isCentroTreinamento: [false],
      cep: [{ value: '', disabled: true }],
      latitude: [{ value: null, disabled: true }],
      longitude: [{ value: null, disabled: true }]
    });

    this.form.get('isCentroTreinamento')?.valueChanges.subscribe(value => {
      this.conta.isCentroTreinamento = value;
    });

    this.form.get('isCentroTreinamento')?.valueChanges.subscribe(mostrar => {
      const campos = ['cep', 'latitude', 'longitude'];
      campos.forEach(campo => {
        const ctrl = this.form.get(campo);
        if (mostrar) {
          ctrl?.enable();
        } else {
          ctrl?.disable();
          ctrl?.reset();
        }
      });
    });

  }

  usarLocalizacao(): void {
    if (!navigator.geolocation) {
      this.snackBar.open('Geolocalização não suportada pelo navegador.', 'Fechar', { duration: 3000 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.form.patchValue({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      () => {
        this.snackBar.open('Não foi possível obter a localização.', 'Fechar', { duration: 3000 });
      }
    );
  }

  cadastrar(){
    this.form.markAllAsTouched();
    if (this.form.invalid || this.carregando()) return; // Evita múltiplos submits

    this.carregando.set(true);
    this.erro.set(null);

    this.conta.nome = this.form.get('nome')?.value;
    this.conta.email = this.form.get('email')?.value;
    this.conta.senha = this.form.get('senha')?.value;
    this.conta.descricao = this.form.get('descricao')?.value;
    this.conta.isCentroTreinamento = this.form.get('isCentroTreinamento')?.value;
    this.conta.cep = this.form.get('cep')?.value || undefined;
    this.conta.latitude = this.form.get('latitude')?.value ?? undefined;
    this.conta.longitude = this.form.get('longitude')?.value ?? undefined;

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
