import { Component, inject } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { ClientStateService } from '../../../services/client-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ClientResponse,
  Gender,
  Nationality,
  State,
} from '../../../interfaces/client.interface';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-client',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent {
  private clientService = inject(ClientService);
  private clientStateService = inject(ClientStateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public client!: ClientResponse | null;
  public isEditing: boolean = false; // para alternar entre modo visualización y edición

  // recuperamos las enumeraciones
  public countries = Object.values(Nationality);
  public genders = Object.values(Gender);
  public states = Object.values(State);

  public loading = this.clientStateService.loading();
  public error = this.clientStateService.error();

  private fb = inject(FormBuilder);

  public invalidForm: boolean = false;
  public updateForm!: FormGroup;

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClient(clientId);

      this.updateForm = this.fb.group({
        longName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
        age: new FormControl('', [
          Validators.required,
          Validators.min(18),
          Validators.max(120),
        ]),
        gender: new FormControl('', [
          Validators.required,
          Validators.pattern(`^(${this.genders.join('|')})$`),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        nationality: new FormControl('', [
          Validators.pattern(`^(${this.countries.join('|')})$`),
        ]),
        state: new FormControl('', [
          Validators.required,
          Validators.pattern(`^(${this.states.join('|')})$`),
        ]),
        phone: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^\+?(?:\d{1,3})?[-\s]?\(?\d{1,4}\)?[-\s]?\d{6,10}$/
          ),
        ]),
        canDrive: new FormControl('', [Validators.required]),
        wearGlasses: new FormControl('', [Validators.required]),
        isDiabetic: new FormControl('', [Validators.required]),
        otherDiseases: new FormControl('', [
          Validators.maxLength(500),
          this.noWhiteSpaceValidator,
        ]),
      });
    }
  }

  loadClient(id: string): void {
    this.clientService.getClientById(id).subscribe({
      next: (res) => {
        if (res) {
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
    if (clientForm.valid && this.client?.id) {
      // aseguramos que id existe
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

  // este es ubn custom validator para verificar nohaya espacios en blanco
    private noWhiteSpaceValidator(control: AbstractControl) {
      if (control.value && typeof control.value === 'string') {
        return control.value.trim() === ''
          ? { whitespace: 'No puede contener sólo espacios en blanco' }
          : null;
      }
      return null;
    }

    // ERRORES

  showEmailErrors() {
    const email = this.updateForm.get('email');

    if (email?.touched && !email.valid) {
      switch (true) {
        case email.errors!['required']:
          return 'El Email es obligatoria';
        case email.errors!['email']:
          return 'Debe tener formato email';
        default:
          return null;
      }
    }
    return null;
  }

  showLongNameErrors() {
    const longName = this.updateForm.get('longName');
    if (longName?.touched && !longName.valid) {
      switch (true) {
        case longName.errors!['required']:
          return 'El nombre es obligatorio';
        case longName.errors!['minlength']:
          return `El nombre debe tener al menos ${longName.errors!['minlength'].requiredLength} caracteres`;
        case longName.errors!['maxlength']:
          return `El nombre no puede exceder los ${longName.errors!['maxlength'].requiredLength} caracteres`;
        default:
          return null;
      }
    }
    return null;
  }
  
  showAgeErrors() {
    const age = this.updateForm.get('age');
    if (age?.touched && !age.valid) {
      switch (true) {
        case age.errors!['required']:
          return 'La edad es obligatoria';
        case age.errors!['min']:
          return `La edad debe ser mayor o igual a ${age.errors!['min'].min}`;
        case age.errors!['max']:
          return `La edad no puede ser mayor a ${age.errors!['max'].max}`;
        default:
          return null;
      }
    }
    return null;
  }
  
  showGenderErrors() {
    const gender = this.updateForm.get('gender');
    if (gender?.touched && !gender.valid) {
      switch (true) {
        case gender.errors!['required']:
          return 'El género es obligatorio';
        case gender.errors!['pattern']:
          return `El género debe ser uno de los siguientes: ${this.genders.join(', ')}`;
        default:
          return null;
      }
    }
    return null;
  }
  
  showNationalityErrors() {
    const nationality = this.updateForm.get('nationality');
    if (nationality?.touched && !nationality.valid) {
      switch (true) {
        case nationality.errors!['pattern']:
          return `La nacionalidad debe ser una de las siguientes: ${this.countries.join(', ')}`;
        default:
          return null;
      }
    }
    return null;
  }
  
  showStateErrors() {
    const state = this.updateForm.get('state');
    if (state?.touched && !state.valid) {
      switch (true) {
        case state.errors!['required']:
          return 'El estado de cliente es obligatorio';
        case state.errors!['pattern']:
          return `El estado debe ser uno de los siguientes: ${this.states.join(', ')}`;
        default:
          return null;
      }
    }
    return null;
  }
  
  showPhoneErrors() {
    const phone = this.updateForm.get('phone');
    if (phone?.touched && !phone.valid) {
      switch (true) {
        case phone.errors!['required']:
          return 'El teléfono es obligatorio';
        case phone.errors!['pattern']:
          return 'El formato del teléfono es inválido';
        default:
          return null;
      }
    }
    return null;
  }
  
  showOtherDiseasesErrors() {
    const otherDiseases = this.updateForm.get('otherDiseases');
    if (otherDiseases?.touched && !otherDiseases.valid) {
      switch (true) {
        case otherDiseases.errors!['maxlength']:
          return `El campo no puede exceder los ${otherDiseases.errors!['maxlength'].requiredLength} caracteres`;
        case otherDiseases.errors!['whitespace']:
          return `El campo no puede estar vacío o contener solo espacios`;
        default:
          return null;
      }
    }
    return null;
  }
}
