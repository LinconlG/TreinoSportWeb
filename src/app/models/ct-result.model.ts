export interface CTResult {
  codigo: number;
  nome: string;
  descricao: string;
  distanciaKm: number;
  modalidades: string[];
}

export interface BuscarCTsParams {
  latitude?: number;
  longitude?: number;
  cep?: string;
  modalidade?: string;
  raio?: number;
}
