import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/enviroment";
import { Treino } from "../../models/treino.model";
import { AuthService } from "../../auth.service";

@Injectable({
  providedIn: "root"
})

export class TreinoService {
  private apiUrl = environment.apiUrl + "/treino";
  private token: string;
  private headers: HttpHeaders;

  constructor(private authService: AuthService, private http: HttpClient) {
    this.token = this.authService.getToken();
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }



  getTreinos(): Observable<Treino[]> {
    // 1. Define os queryParams
    //const params = new HttpParams().set('codigoCT', codigoCT);

    // 2. Faz a requisição com as opções
    return this.http.get<Treino[]>(
      `${this.apiUrl}/ct/todos`,
      {
        headers: this.headers  // Envia o token no header
      }
    );
  }

  getTreino(id: number): Observable<Treino> {
    return this.http.get<Treino>(`${this.apiUrl}/${id}`);
  }

  createTreino(treino: Treino): Observable<void> {
    console.log(this.token);
    console.log(treino);
    const token = this.authService.getToken();
    const headers = new HttpHeaders ({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<void>(`${this.apiUrl}/ct/criar`, treino, { headers: headers });
  }
}
