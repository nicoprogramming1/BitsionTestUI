import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserRegisterRequest } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-register-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  public invalidForm: boolean = false;
  public registerForm!: FormGroup;
  public successMessage: string | null = null;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;

      const user: UserRegisterRequest = {
        email: formValues.email,
        password: formValues.password,
      };

      this.authService.userRegister(user).subscribe({
        next: (res) => {
          if(res){
            console.log('Se ha registrado con éxito al usuario con email: ', res?.email);
            this.invalidForm = false;
            this.successMessage = 'El usuario se ha creado con éxito';
          }
        },
        error: (err) => {
          console.error('Ha habido un error en el registro', err);
          this.invalidForm = true;
        },
        complete: () => {
          this.resetForm();
        },
      });
    } else {
      this.invalidForm = true;
      console.log('El formulario no está validado');
    }
  }

  resetForm(): void {
    this.registerForm.reset();
    this.invalidForm = false;
  }

 
  showEmailErrors() {
    const email = this.registerForm.get('email');

    if (email?.touched && !email.valid) {
      switch (true) {
        case email.errors!['required']:
          return 'El Email es obligatorio';
        case email.errors!['email']:
          return 'Debe tener formato email';
        default:
          return null;
      }
    }
    return null;
  }

  showPasswordErrors() {
    const password = this.registerForm.get('password');

    if (password?.touched && !password.valid) {
      switch (true) {
        case password.errors!['required']:
          return 'La contraseña es obligatoria';
        case password.errors!['minLength']:
          return 'La contraseña debe tener al menos 8 caracteres';
        default:
          return null;
      }
    }
    return null;
  }
}