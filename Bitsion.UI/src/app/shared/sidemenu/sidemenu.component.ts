import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css'],
})
export class SidemenuComponent {
  private router = inject(Router);
  menuItems: any[] = [];

  ngOnInit() {
    this.loadMenu();
  }

  private loadMenu(): void {
    this.menuItems = this.router.config
      .filter((route) => route.title && route.path !== 'login' && route.path !== 'client/:id') // Eliminamos 'login' y 'client/:id'
      .map((route) => ({ title: route.title, path: route.path, children: route.children }));
  }
}
