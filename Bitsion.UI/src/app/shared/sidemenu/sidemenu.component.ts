import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public userRole: string | null = null;
  menuItems: any[] = [];

  ngOnInit() {
    this.decodeRoleFromToken();
    this.loadMenu();
  }

  private decodeRoleFromToken(): void {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decodedToken = this.authService.decodeToken(accessToken); // decodificamos el token
      this.userRole = decodedToken?.role || null; // extrae el rol del token
    }
  }

  // filtra las rutas del menu segun el data de cada ruta en el routes por rol
  private loadMenu(): void {
    if (!this.userRole) return;

    this.menuItems = this.router.config
      .filter((route) => route.data?.['menu']) // verificamos si 'data' es undefined
      .filter(
        (route) =>
          !route.data?.['menu'].role ||
          route.data?.['menu'].role === this.userRole
      )
      .map((route) => route.data?.['menu']);
  }
}
