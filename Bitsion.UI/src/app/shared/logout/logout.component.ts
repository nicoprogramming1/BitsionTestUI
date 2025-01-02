import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService)


  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']), // si todo ok, redirigimos al login
      error: (err) => {
        console.error('Error during logout:', err);
      },
    });
  }
}