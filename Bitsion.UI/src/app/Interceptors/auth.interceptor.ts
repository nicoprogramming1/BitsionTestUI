import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `${accessToken}`,
        },
      });
    }

    console.log('Outgoing Request', {
      url: req.url,
      method: req.method,
      headers: req.headers.keys(),
      body: req.body,
    });

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // si el token expiró intentamos renovarlo
          return this.handleUnauthorizedError(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * maneja errores de autenticación intentando renovar el token y reenviando la solicitud
   * el req es la  solicitud HTTP original
   * el next el controlador HTTP
   */
  private handleUnauthorizedError(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap((newTokens) => {
        if (newTokens?.accessToken) {
          // actualizamos la solicitud con el nuevo token
          req = req.clone({
            setHeaders: {
              Authorization: `${newTokens.accessToken}`,
            },
          });
          return next.handle(req); // reintentar la solicitud original
        }
        this.authService.logout(); // si no se puede renovar el token, cerrar sesión
        return throwError(() => new Error('No se pudo renovar el token o ambos tokens expiraron'));
      }),
      catchError((err) => {
        this.authService.logout();
        return throwError(() => err);
      })
    );
  }
}
