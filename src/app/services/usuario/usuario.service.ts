import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Conta } from '../../models/conta.model';


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
}
