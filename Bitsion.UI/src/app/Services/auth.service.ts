import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { environment } from './../../environments/environment';
import { User, UserLoginRequest, UserRegisterRequest, UserResponse } from '../Interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authStateService = inject(AuthStateService);

  /** Registro de usuario */
  userRegister(request: UserRegisterRequest): Observable<User | null> {
    this.authStateService.setLoadingState(); // establecemos el estado de loading
    return this.http.post<UserResponse>(`${this.apiUrl}/auth/register`, request).pipe(
      map((res) => {
        this.authStateService.saveUserState(res); // guardamos el usuario en state y loading: false
        return res;
      }),
      catchError((err) => {
        const errorMessage = err.error?.message || err.message;
        this.handleError(errorMessage);
        return of(null);
      })
    );
  }

  /** Login de usuario */
  login(request: UserLoginRequest): Observable<UserResponse | null> {
    this.authStateService.setLoadingState(); // Establecer el estado de carga
    return this.http.post<UserResponse>(`${this.apiUrl}/auth/login`, request).pipe(
      map((res) => {
        this.storeTokens(res); // Almacenar tokens, si son obtenidos
        this.authStateService.setLoadingState(); // Terminar estado de carga
        return res;
      }),
      catchError((err) => {
        this.handleError(err.message); // Manejar error
        return of(null);
      })
    );
  }

  /** Logout de usuario */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Aquí no necesitamos estado de error ni de carga, por lo que no afecta
  }

  /** Refresh Token */
  refreshToken(): Observable<UserResponse | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.authStateService.setErrorState('No hay token de refresco disponible.'); // Establecer mensaje de error
      return of(null);
    }
    
    this.authStateService.setLoadingState(); // Establecer estado de carga

    return this.http.post<UserResponse>(`${this.apiUrl}/auth/refresh-token`, { refreshToken }).pipe(
      map((res) => {
        this.storeTokens(res); // Almacenar tokens
        this.authStateService.setLoadingState(); // Terminar estado de carga
        return res;
      }),
      catchError((err) => {
        this.handleError(err.message); // Manejar error
        return of(null);
      })
    );
  }

  /** Obtener usuario actual */
  getCurrentUser(): Observable<UserResponse | null> {
    this.authStateService.setLoadingState(); // Establecer estado de carga
    return this.http.get<UserResponse>(`${this.apiUrl}/auth/current-user`).pipe(
      map((res) => {
        this.authStateService.setLoadingState(); // Terminar estado de carga
        return res;
      }),
      catchError((err) => {
        this.handleError(err.message); // Manejar error
        return of(null);
      })
    );
  }

  // este es el manejador de errores del service, le enviamos el mensaje de error
  private handleError(errorMessage: string): void {
    this.authStateService.setErrorState(errorMessage); // establecer el error
  }

  /** Almacenar tokens en localStorage */
  private storeTokens(res: UserResponse): void {
    if (res.accessToken) {
      localStorage.setItem('accessToken', res.accessToken);
    }
    if (res.refreshToken) {
      localStorage.setItem('refreshToken', res.refreshToken);
    }
  }
}
