import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Treino } from '../../../models/treino.model';

@Component({
  selector: 'app-editar-treino',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatInputModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './editar-treino.component.html',
  styleUrl: './editar-treino.component.css'
})
export class EditarTreinoComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public treino: Treino,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditarTreinoComponent>
  ) {
    this.form = this.fb.group({
      nome: [treino.nome, Validators.required],
      descricao: [treino.descricao],
      limiteAlunos: [treino.limiteAlunos, [Validators.required, Validators.min(1)]],
      dataVencimento: [treino.dataVencimento ? new Date(treino.dataVencimento).toISOString().split('T')[0] : '']
    });
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const updated: Treino = { ...this.treino, ...this.form.value };
    this.dialogRef.close(updated);
  }

  fechar(): void {
    this.dialogRef.close(false);
  }
}
