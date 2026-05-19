import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { CTResult, BuscarCTsParams } from '../../models/ct-result.model';

@Component({
  selector: 'app-buscar-cts',
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-cts.component.html',
  styleUrl: './buscar-cts.component.css'
})
export class BuscarCtsComponent implements OnInit {
  resultados: CTResult[] = [];
  resultadosFiltrados: CTResult[] = [];
  modalidadeFiltro = '';
  raio = 20;
  cep = '';
  isLoading = signal(false);
  erro = signal<string | null>(null);
  localizacaoNegada = signal(false);
  cidadeViaCep = signal<string | null>(null);

  private lat: number | null = null;
  private lng: number | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.solicitarLocalizacao();
  }

  solicitarLocalizacao(): void {
    if (!navigator.geolocation) {
      this.localizacaoNegada.set(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        this.buscar();
      },
      () => {
        this.localizacaoNegada.set(true);
      }
    );
  }

  buscarPorCep(): void {
    if (!this.cep || this.cep.replace(/\D/g, '').length !== 8) {
      this.erro.set('CEP inválido. Informe 8 dígitos.');
      return;
    }
    this.erro.set(null);
    this.buscar();
  }

  buscar(): void {
    this.isLoading.set(true);
    this.erro.set(null);
    const params: BuscarCTsParams = {
      latitude: this.lat ?? undefined,
      longitude: this.lng ?? undefined,
      cep: this.lat == null ? this.cep : undefined,
      raio: this.raio
    };
    this.usuarioService.buscarCTs(params).subscribe({
      next: (cts) => {
        this.resultados = cts;
        this.aplicarFiltro();
        this.isLoading.set(false);
      },
      error: (e) => {
        this.erro.set(e?.error?.message || 'Erro ao buscar CTs. Tente novamente.');
        this.isLoading.set(false);
      }
    });
  }

  aplicarFiltro(): void {
    if (!this.modalidadeFiltro) {
      this.resultadosFiltrados = this.resultados;
    } else {
      this.resultadosFiltrados = this.resultados.filter(ct =>
        ct.modalidades?.some(m => m.toLowerCase().includes(this.modalidadeFiltro.toLowerCase()))
      );
    }
  }
}
