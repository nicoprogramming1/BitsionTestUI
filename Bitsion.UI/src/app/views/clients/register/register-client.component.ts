import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { ClientRegisterRequest, Gender, Nationality, State } from '../../../interfaces/client.interface';

@Component({
  selector: 'app-register-client',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css',
})
export class RegisterClientComponent {
  private clientService = inject(ClientService);
  private fb = inject(FormBuilder);

  public invalidForm: boolean = false;
  public registerForm!: FormGroup;
  public successMessage: string | null = null;

  // recuperamos las enumeraciones
  public countries = Object.values(Nationality)
  public genders = Object.values(Gender)
  public states = Object.values(State)

  ngOnInit(): void {
    this.registerForm = this.fb.group({
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
          /^\+?(?:\d{1,3})?[-\s]?\(?\d{1,4}\)?[-\s]?\d{6,10}$/,
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

  onSubmit() {
    if (this.registerForm.valid) {
      const client: ClientRegisterRequest = this.registerForm.value;

      this.clientService.registerClient(client).subscribe({
        next: (res) => {
          if(res){
            console.log('Cliente registrado con éxito:', res?.longName);
            this.invalidForm = false;
            this.successMessage = 'El cliente se ha creado con éxito';
          }
        },
        error: (err) => {
          console.error('Error al registrar el cliente', err);
          this.invalidForm = true;
        },
        complete: () => {
          this.resetForm();
        },
      });
    } else {
      this.invalidForm = true;
      console.log('El formulario no es válido');
    }
  }

  resetForm(): void {
    this.registerForm.reset();
    this.invalidForm = false;
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
    const email = this.registerForm.get('email');

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
    const longName = this.registerForm.get('longName');
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
    const age = this.registerForm.get('age');
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
    const gender = this.registerForm.get('gender');
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
    const nationality = this.registerForm.get('nationality');
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
    const state = this.registerForm.get('state');
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
    const phone = this.registerForm.get('phone');
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
  
  showCanDriveErrors() {
    const canDrive = this.registerForm.get('canDrive');
    if (canDrive?.touched && !canDrive.valid) {
      return 'Este campo es obligatorio';
    }
    return null;
  }
  
  showWearGlassesErrors() {
    const wearGlasses = this.registerForm.get('wearGlasses');
    if (wearGlasses?.touched && !wearGlasses.valid) {
      return 'Este campo es obligatorio';
    }
    return null;
  }
  
  showIsDiabeticErrors() {
    const isDiabetic = this.registerForm.get('isDiabetic');
    if (isDiabetic?.touched && !isDiabetic.valid) {
      return 'Este campo es obligatorio';
    }
    return null;
  }
  
  showOtherDiseasesErrors() {
    const otherDiseases = this.registerForm.get('otherDiseases');
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
