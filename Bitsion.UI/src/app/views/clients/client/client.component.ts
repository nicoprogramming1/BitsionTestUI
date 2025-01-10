import { Component, inject } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { ClientStateService } from '../../../services/client-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientResponse, Gender, Nationality, State } from '../../../interfaces/client.interface';
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
  private router = inject(Router)

  public client!: ClientResponse | null;
  public isEditing: boolean = false;  // para alternar entre modo visualización y edición

    // recuperamos las enumeraciones
    public countries = Object.values(Nationality)
    public genders = Object.values(Gender)
    public states = Object.values(State)

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
      console.error('El cliente no tiene ID o el formulario es inválido');
    }
  }

  onDelete(clientId: string | undefined): void {
    if (clientId) {
      this.clientService.deleteClient(clientId).subscribe({
        next: () => {
            this.router.navigate(['/list']);
        },
        error: (err) => {
          console.error('Error al eliminar el cliente: ', err.message);
        },
      });
    } else {
      console.error('El ID de lcliente no está disponible');
    }
  }
  
}