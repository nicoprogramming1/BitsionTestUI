import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../services/auth-state.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, LoadingSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService)
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public loginForm!: FormGroup;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  public loadingState = this.authStateService.loading() // computed signals para acceder al state de userAuth
  public errorState = this.authStateService.error()

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // getters de los inputs del form
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.successMessage = null;
      return;
    }
  
    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
  
    this.authService.login(payload).subscribe({
      next: (res) => {
        if (res) {
          this.router.navigate(['/clients']);
          this.successMessage = 'Inicio de sesión exitoso';
          this.errorMessage = null;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error en el inicio de sesión. Por favor, verifica tus credenciales.';
        this.successMessage = null;
      },
    });
  }
  
  
}