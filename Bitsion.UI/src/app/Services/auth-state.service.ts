import { computed, Injectable, signal } from '@angular/core';
import { User, UserState } from '../Interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  #state = signal<UserState>({
      user: null,
      error: null,
      loading: true,
    });
  
    public user = computed(() => this.#state().user);
    public error = computed(() => this.#state().error);
    public loading = computed(() => this.#state().loading);
  
    /**
     * Los siguientes métodos sólo son utilizados por la Gestión de Autenticación
     * Estarán involucrados en toda funcionalidad que interactúe con
     * la entidad Usuario para gestionar los estados tanto de carga y error
     * como del registro para ser observados desde donde se necesite en la aplicación
     */
  
    public setLoadingState() {
      this.#state.update((state) => ({ ...state, loading: true, error: null }));
    }
  
    public setErrorState(message: string) {
      this.#state.update((state) => ({
        ...state,
        loading: false,
        error: message || 'Ha ocurrido un error en la solicitud',
      }));
    }
  
  
    public getCurrentUserState(user: User) {
      this.#state.update((state) => ({
        ...state,
        loading: false,
        error: null,
        user,
      }));
    }
    
    public saveUserState(user: User) {
      this.#state.update((state) => {
        return {
          ...state,
          loading: false,
          error: null,
          user
        };
      });
    }
  }