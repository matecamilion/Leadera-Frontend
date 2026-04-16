import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CrearInteraccionRequest {
  detalle: string;
  fechaInteraccion: string;
  tipoInteraccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class InteraccionService {

  private apiUrl = 'http://localhost:8080/leads';

  constructor(private http: HttpClient) {}

  crearInteraccion(leadId: number, body: CrearInteraccionRequest, proximoContacto?: string): Observable<any> {
    
    let params = new HttpParams();
    
    // Si viene la fecha, la agregamos a los parámetros de la URL
    if (proximoContacto) {
      params = params.append('proximoContacto', proximoContacto);
    }

    return this.http.post(`${this.apiUrl}/${leadId}/interacciones`, body, { params });
  }
}
