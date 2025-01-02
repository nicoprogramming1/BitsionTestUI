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
import { AuthService } from '../Services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authService = inject(AuthService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken'); // primero recuperamos el token

    // si existe lo adjuntamos a la solicitud http
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        // si el token expiró intentamos renovarlo
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handleUnauthorizedError(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap((newTokens) => {
        if (newTokens?.accessToken) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newTokens.accessToken}`,
            },
          });
          return next.handle(req);  // una vez refrescado intenta la solicitud original
        }
        return throwError(() => new Error('No se pudo renovar el token'));
      }),
      catchError((err) => {
        this.authService.logout();  // si falla redirigimos a iniciar sesión
        return throwError(() => err);
      })
    );
  }
}
