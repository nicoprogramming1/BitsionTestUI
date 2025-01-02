import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { environment } from './../../environments/environment';
import { User, UserRegisterRequest, UserResponse } from '../Interfaces/user.interface';

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
    return this.http.post<UserResponse>(`${this.apiUrl}/auth/register`, request).pipe(
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

  
}
