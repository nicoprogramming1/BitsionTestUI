import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { ClientService } from '../../../services/client.service';
import { ClientStateService } from '../../../services/client-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  private clientService = inject(ClientService);
  private clientStateService = inject(ClientStateService);
  private router = inject(Router)

  public loading = this.clientStateService.loading;
  public error = this.clientStateService.error;
  public clients = this.clientStateService.clients;

  public page: number = 1;
  public totalPages: number = 1;  // total de páginas que tenemos
  public totalClients: number = 0;

  public filter = {
    email: '',
    longName: ''
  };

  ngOnInit(): void {
    this.loadClients(this.page);
  }

  loadClients(page: number) {
    this.clientService.getClientsList(page, this.filter.longName, this.filter.email).subscribe({
      next: (res) => {
        if (res) {
          this.page = page;
          this.totalClients = res.totalCount;
          this.totalPages = Math.ceil(this.totalClients / res.pageSize); // calcula total de páginas
        }
      },
      error: (err) => {
        console.error('Error al cargar clientes: ', err.message);
      },
    });
  }

  applyFilters(event: Event) {
    event.preventDefault();
    this.loadClients(1);
  }
  
  consultClient(clientId: string | undefined): void {
    if (!clientId) {
      console.error("El ID del cliente es inválido");
      return;
    }
    this.router.navigate(['/client', clientId]);
  }
  

  // FUNCIONES AUXILIARES

  // existe página anterior?
  canGoBack(): boolean {
    return this.page > 1;
  }

  // existe pagina siguiente?
  canGoNext(): boolean {
    return this.page < this.totalPages;
  }

  // cambia a uan página expecífica
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadClients(page);
    }
  }
  
}