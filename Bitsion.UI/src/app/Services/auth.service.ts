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
  private apiUrl = environment.apiUrl.auth;
  private http = inject(HttpClient);
  private authStateService = inject(AuthStateService);

  userRegister(request: UserRegisterRequest): Observable<User | null> {
    this.authStateService.setLoadingState(); // establecemos el estado de loading
    return this.http
      .post<UserResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        map((res) => {
          if (res) {
            this.authStateService.setSaveUserState(res); // guardamos el usuario en state y loading: false
          }
          return res;
        }),
        catchError((err) => {
          const errorMessage = err.error?.message || err.message;
          this.handleError(errorMessage);
          return of(null);
        })
      );
  }

  private handleError(errorMessage: string): void {
    this.authStateService.setErrorState(errorMessage); // establecer el error
  }

  login(request: UserLoginRequest): Observable<User | null> {
    this.authStateService.setLoadingState();
    return this.http
      .post<UserResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        map((res) => {
          if (res) {
            const { accessToken, refreshToken, ...user } = res; // desestructuramos la respuesta
            this.storeTokens({ accessToken, refreshToken }); // al recibir los tokens los guardamos en localStorage
            this.authStateService.setCurrentUserState(user);
            return user;
          }
          return null;
        }),
        catchError((err) => {
          const errorMessage = err.error?.message || err.message;
          this.handleError(errorMessage);
          return of(null);
        })
      );
  }

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

  logout(): Observable<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      return this.revokeRefreshToken(refreshToken).pipe(
        map(() => {
          this.clearTokens(); // limpiamos los tokens si la revocación fue exitosa
        }),
        catchError((err) => {
          console.error('Error revoking refresh token:', err); // Manejamos cualquier error
          this.clearTokens(); // limpiamos los tokens incluso si hay un error
          return of(); // necesitamos retornar un observable para prevenir bloqueos
        })
      );
    } else {
      this.clearTokens(); // si no hay tokens los eliminamos
      return of();
    }
  }
  
  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private revokeRefreshToken(refreshToken: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/revoke-refresh-token`, { refreshToken })
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
      .post<UserResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        map((res) => {
          if (res) {
            const { accessToken, refreshToken, ...user } = res; // desestructuramos la respuesta
            this.storeTokens({ accessToken, refreshToken });
            return user;
          }
          return null;
        }),
        catchError((err) => {
          const errorMessage = err.error?.message || err.message;
          this.handleError(errorMessage);
          return of(null);
        })
      );
  }

  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) return false;
  
    const payload = this.decodeToken(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime; // verificamos si el token no está expirado
  }
  
  decodeToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  }
}
