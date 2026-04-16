import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient){};

  registrar(agente: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, agente);
  }

  login(credentials: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, credentials, {responseType: 'text'}).pipe(
      tap(token => {
        localStorage.setItem('token', token)
      })
    )
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout(){
    localStorage.removeItem('token');
  }
}
