import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { environment } from '../../environments/environment';
import {
  User,
  UserLoginRequest,
  UserRegisterRequest,
  UserResponse,
} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authStateService = inject(AuthStateService);

  /**
   * Todos los métodos implementan el state management de auth-state.service.ts
   * El handleError se encarga de gestionar los errores y sus mensajes
   */

  userRegister(request: UserRegisterRequest): Observable<User | null> {
    this.authStateService.setLoadingState(); // establecemos el estado de loading
    return this.http
      .post<UserResponse>(`${this.apiUrl}/auth/register`, request)
      .pipe(
        map((res) => {
          this.authStateService.setSaveUserState(res); // guardamos el usuario en state y loading: false
          return res;
        }),
        catchError((err) => {
          const errorMessage = err.error?.message || err.message;
          this.handleError(errorMessage);
          return of(null);
        })
      );
  }

  // este es el manejador de errores del service, le enviamos el mensaje de error
  private handleError(errorMessage: string): void {
    this.authStateService.setErrorState(errorMessage); // establecer el error
  }

  // nos devuelven el user con la info de tokens si es 200
  login(request: UserLoginRequest): Observable<User | null> {
    this.authStateService.setLoadingState();
    return this.http
      .post<UserResponse>(`${this.apiUrl}/auth/login`, request)
      .pipe(
        map((res) => {
          const { accessToken, refreshToken, ...user } = res; // desestructuramos la respuesta
          this.storeTokens({ accessToken, refreshToken }); // al recibir los tokens los guardamos en localStorage
          this.authStateService.setCurrentUserState(user);
          return user;
        }),
        catchError((err) => {
          const errorMessage = err.error?.message || err.message;
          this.handleError(errorMessage);
          return of(null);
        })
      );
  }

  // los tokens serán almacenados en localStorage para uso en la aplicación
  private storeTokens({
    accessToken,
    refreshToken,
  }: {
    accessToken?: string;
    refreshToken?: string;
  }): void {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  /**
   * Debemos revocar tanto los tokens del usuario en el frontend
   * como en el backend, para mantenerlos sincronizados y seguros por igual
   * por lo tanto primero revocamos del back, si todo ok procedemos a revocar
   * del front
   */
  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.revokeRefreshToken(refreshToken).subscribe({
        next: () => {
          // Una vez que el refresh token ha sido revocado en el backend eliminamos los tokens locales
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        },
        error: (err) => {
          const errorMessage =
            err.error?.message || err.message || 'Error al cerrar sesión.';
          this.authStateService.setErrorState(errorMessage);
        },
      });
    } else {
      // Si no hay refresh token simplemente eliminamos amboss
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // este método revoca el refresh token del backend
  private revokeRefreshToken(refreshToken: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/revoke-refresh-token`, { refreshToken })
      .pipe(
        catchError((err) => {
          const errorMessage =
            err.error?.message || err.message || 'Error al revocar el token.';
          this.authStateService.setErrorState(errorMessage);
          return of(null);
        })
      );
  }

  refreshToken(): Observable<UserResponse | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return of(null);
    }

    return this.http
      .post<UserResponse>(`${this.apiUrl}/auth/refresh-token`, { refreshToken })
      .pipe(
        map((res) => {
          const { accessToken, refreshToken, ...user } = res; // desestructuramos la respuesta
          this.storeTokens({ accessToken, refreshToken });
          return user;
        }),
        catchError((err) => {
          const errorMessage = err.error?.message || err.message;
          this.handleError(errorMessage);
          return of(null);
        })
      );
  }

  // verificamos si el usuario está autenticado para acceder a un recurso
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) return false;
  
    const payload = this.decodeToken(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime; // verificamos si el token no está expirado
  }
  
  // sólo decodifica el token
  private decodeToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  }
  
}
