import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  logout() {
    console.log('Cerrando sesión...');
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout exitoso, redirigiendo al login...');
        this.router.navigate(['/login']); // redirigimos al login
      },
      error: (err) => {
        console.error('Error durante el logout:', err);
      },
    });
  }
}
