import { computed, Injectable, signal } from '@angular/core';
import { Client, ClientState } from '../Interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientStateService {
  constructor() {}

  #state = signal<ClientState>({
    clients: [],
    client: null,
    error: null,
    loading: true,
  });

  public clients = computed(() => this.#state().clients);
  public client = computed(() => this.#state().client);
  public error = computed(() => this.#state().error);
  public loading = computed(() => this.#state().loading);

  public loadingState() {
    this.#state.update((state) => ({ ...state, loading: true, error: null }));
  }

  public getOneState(client: Client) {
    this.#state.update((state) => ({
      ...state,
      loading: false,
      error: null,
      client,
    }));
  }

  public getAllState(clients: Client[]) {
    this.#state.update((state) => ({
      ...state,
      loading: false,
      error: null,
      clients,
    }));
  }

  public deleteOneState(id: string) {
    this.#state.update((state) => ({
      ...state,
      loading: false,
      error: null,
      clients: this.clients().filter((client) => client.id !== id),
    }));
  }
  

  public deleteAllState() {
    this.#state.update((state) => ({
      ...state,
      loading: false,
      error: null,
      clients: [],
    }));
  }

  public saveClientState(client: Client | Client[]) {
    this.#state.update((state) => {
      const clientsToSave = Array.isArray(client) ? client : [client];
      return {
        ...state,
        loading: false,
        error: null,
        clients: [...state.clients, ...clientsToSave], // Agrega múltiples o un solo cliente
        client: Array.isArray(client) ? null : client, // Mantiene el último cliente agregado si no es un array
      };
    });
  }

  public updateClientState(updatedClient: Client) {
    const normalizeclient = (client: any) => ({
      ...client,
      name: client.name,
      price: client.price
    });
  
    this.#state.update((state) => {
      const updatedClients = state.clients.map((client) =>
        client.id === updatedClient.id ? normalizeclient(updatedClient) : client
      );
  
      return {
        ...state,
        loading: false,
        error: null,
        client: normalizeclient(updatedClient), // cliente individual actualizado
        clients: updatedClients, // Lista de clientes actualizada
      };
    });
  }
  

  public errorState(message: string) {
    this.#state.update((state) => ({
      ...state,
      loading: false,
      error: message || 'Ha ocurrido un error en la solicitud',
    }));
  }
}