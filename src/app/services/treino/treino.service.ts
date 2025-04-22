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

  constructor(private authService: AuthService, private http: HttpClient) {}

  getTreinos(): Observable<Treino[]> {
    // 1. Define os queryParams
    //const params = new HttpParams().set('codigoCT', codigoCT);
    const token = this.authService.getToken();

    // 2. Define os headers (com token)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Faz a requisição com as opções
    return this.http.get<Treino[]>(
      `${this.apiUrl}/ct/todos`,
      {
        headers  // Envia o token no header
      }
    );
  }

  getTreino(id: number): Observable<Treino> {
    return this.http.get<Treino>(`${this.apiUrl}/${id}`);
  }

  createTreino(treino: Treino): Observable<Treino> {
    return this.http.post<Treino>(this.apiUrl, treino);
  }
}
