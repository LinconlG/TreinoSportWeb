import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../enviroment";

@Injectable({ providedIn: 'root'})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  /**
   * Método GET genérico
   * @param endpoint Ex: 'products'
   * @param params Parâmetros de query (opcional)
   */
  get<T>(endpoint: string, params?: HttpParams) {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params });
  }

  /**
   * Método POST genérico
   * @param endpoint Ex: 'products'
   * @param body Dados do payload
   */
  post<T>(endpoint: string, body: any) {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  put<T>(endpoint: string, body: any) {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body);
  }

}
