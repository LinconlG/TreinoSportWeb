import { Component } from '@angular/core';
import { Conta } from '../models/conta.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, ReactiveFormsModule],
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

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      mostrarInput: [false],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      descricao: [''],
      IsCentroTreinamento: [false]
    });

    this.form.get('mostrarInput')?.valueChanges.subscribe(mostrar => {
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
}
