import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  Client,
  ClientRegisterRequest,
  ClientResponse,
  ClientsResponse,
} from '../interfaces/client.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { ClientStateService } from './client-state.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = environment.apiUrl.clients;
  private http = inject(HttpClient);
  private clientStateService = inject(ClientStateService);

  registerClient(request: ClientRegisterRequest): Observable<Client | null> {
    this.clientStateService.setLoadingState(); // establece el estado de carga

    return this.http
      .post<ClientResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        map((response) => {
          if (response) {
            // asegura q la res sea valida
            this.clientStateService.saveClientState(response); // guarda al cliente en el estado después de la respuesta
          }
          return response;
        }),
        catchError((err) => {
          const errorMessage = err.error?.message || err.message;
          this.handleError(errorMessage);
          return of(null); // retorna null en caso de error
        })
      );
  }

  // get de la lista de clientes con paginación
  getClientsList(
    pageNumber: number,
    longName: string = '',
    email: string = ''
  ): Observable<ClientsResponse | null> {
    this.clientStateService.setLoadingState();
  
    // encapsulamos los parámetros
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('longName', longName)
      .set('email', email);
  
    return this.http
      .get<ClientsResponse>(this.apiUrl, { params })
      .pipe(
        map((response) => {
          if (response) {
            this.clientStateService.getClientsListState(response.clients);
          }
          return response;
        }),
        catchError((err) => {
          const errorMessage = err.error?.message || err.message;
          this.handleError(errorMessage);
          return of(null);
        })
      );
  }
  

  getClientById(id: string): Observable<ClientResponse | null> {
    this.clientStateService.setLoadingState(); // establece el estado de carga

    return this.http.get<ClientResponse>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (response) {
          this.clientStateService.getOneClientState(response); // actualiza el estado con el cliente obtenido
        }
        return response;
      }),
      catchError((err) => {
        const errorMessage = err.error?.message || err.message;
        this.handleError(errorMessage);
        return of(null); // retorna null en caso de error
      })
    );
  }

  updateClient(id: string, request: Client): Observable<ClientResponse | null> {
    this.clientStateService.setLoadingState(); // establece el estado de carga

    return this.http.put<ClientResponse>(`${this.apiUrl}/${id}`, request).pipe(
      map((response) => {
        if (response) {
          this.clientStateService.updateClientState(response); // actualiza el cliente en el estado
        }
        return response;
      }),
      catchError((err) => {
        const errorMessage = err.error?.message || err.message;
        this.handleError(errorMessage);
        return of(null); // retorna null en caso de error
      })
    );
  }

  deleteClient(id: string): Observable<boolean | null> {
    this.clientStateService.setLoadingState(); // establece el estado de carga

    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (response) {
          this.clientStateService.deleteOneClientState(id); // elimina el cliente del estado
        }
        return response;
      }),
      catchError((err) => {
        const errorMessage = err.error?.message || err.message;
        this.handleError(errorMessage);
        return of(null); // retorna null en caso de error
      })
    );
  }

  private handleError(errorMessage: string): void {
    this.clientStateService.setErrorState(errorMessage); // establecer el error
  }
}
