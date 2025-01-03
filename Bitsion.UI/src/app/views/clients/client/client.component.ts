import { Component, inject } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { ClientStateService } from '../../../services/client-state.service';
import { ActivatedRoute } from '@angular/router';
import { ClientResponse } from '../../../interfaces/client.interface';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-client',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {
  private clientService = inject(ClientService)
  private clientStateService = inject(ClientStateService)
  private route = inject(ActivatedRoute)

  public client!: ClientResponse | null;
  public isEditing: boolean = false;  // para alternar entre modo visualización y edición
  public isConfirmingDelete: boolean = false;

  public loading = this.clientStateService.loading()
  public error = this.clientStateService.error()

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClient(clientId);
    }
  }

  loadClient(id: string): void {
    this.clientService.getClientById(id).subscribe({
      next: (res) => {
        if(res){
          this.client = res;
        }
      },
      error: (err) => {
        console.error('Error al cargar el cliente: ', err.message);
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onSave(clientForm: any): void {
    if (clientForm.valid && this.client?.id) {  // aseguramos que id existe
      this.clientService.updateClient(this.client.id, this.client).subscribe({
        next: (res) => {
          if (res) {
            this.isEditing = false;
          }
        },
        error: (err) => {
          console.error('Error al actualizar el cliente: ', err.message);
        },
      });
    } else {
      console.error('El cliente no tiene ID o el ormulario es inválido');
    }
  }
  

  confirmDelete(): void {
    this.isConfirmingDelete = true;
  }

  cancelDelete(): void {
    this.isConfirmingDelete = false;
  }

  onDelete(clientId: string | undefined): void {
    if (clientId) {
      this.clientService.deleteClient(clientId).subscribe({
        next: (res) => {
          if (res) {
            this.isConfirmingDelete = false;
          }
        },
        error: (err) => {
          console.error('Error al eliminar cliente: ', err.message);
        },
      });
    } else {
      console.error('El ID de lcliente no está disponible');
    }
  }
  
}