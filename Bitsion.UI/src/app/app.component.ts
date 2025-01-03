import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidemenuComponent } from './shared/sidemenu/sidemenu.component';
import { HeaderComponent } from './shared/header/header.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidemenuComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoginRoute = false;

  constructor(private router: Router) {
    // verificar la ruta al navegar
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // verifica si la ruta actual es login
        this.isLoginRoute = event.urlAfterRedirects.includes('login');
      });
  }
}
