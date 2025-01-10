import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { HttpInterceptorFn } from "@angular/common/http";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.getAccessToken();

  // Clonar la solicitud si hay un token válido
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: token || '', // Asegurarse de que nunca sea undefined
        },
      })
    : req; // Si no hay token, pasa la solicitud original

  return next(authReq).pipe(
    catchError((err) => {
      // Manejar errores, como tokens expirados
      return authService.refreshToken().pipe(
        switchMap((res) => {
          // Guardar el nuevo token
          if (res?.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
          }

          // Clonar la solicitud con el nuevo token
          const newReq = req.clone({
            setHeaders: {
              Authorization: res?.accessToken || '', // Proporcionar un valor por defecto explícito
            },
          });

          return next(newReq);
        }),
        catchError((err) => {
          // Manejo de error en caso de fallo total (refreshToken inválido o similar)
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          return throwError(() => new Error(err));
        })
      );
    })
  );
};
