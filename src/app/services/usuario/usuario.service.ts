import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Conta } from '../../models/conta.model';
import { CTResult, BuscarCTsParams } from '../../models/ct-result.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private readonly endpoint = 'usuario';
  constructor(private api: ApiService) { }
    // Exemplo: GET /api/products/1
    getById(id: number) {
      //return this.api.get<Product>(`${this.endpoint}/${id}`);
    }

    // Exemplo: POST /api/products
    cadastrar(conta: Conta) {
      return this.api.put<void>(`${this.endpoint}/cadastrar`, conta);
    }

    buscarCTs(params: BuscarCTsParams): Observable<CTResult[]> {
      let httpParams = new HttpParams();
      if (params.latitude != null) httpParams = httpParams.set('latitude', params.latitude);
      if (params.longitude != null) httpParams = httpParams.set('longitude', params.longitude);
      if (params.cep) httpParams = httpParams.set('cep', params.cep);
      if (params.modalidade) httpParams = httpParams.set('modalidade', params.modalidade);
      if (params.raio != null) httpParams = httpParams.set('raio', params.raio);
      return this.api.get<CTResult[]>('usuario/ct/buscar', httpParams);
    }

    atualizarConta(data: Partial<Conta>): Observable<void> {
      return this.api.patch<void>(`${this.endpoint}/atualizar`, data);
    }
}
