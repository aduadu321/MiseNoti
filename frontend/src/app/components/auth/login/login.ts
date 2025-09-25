import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../interfaces/auth.interface';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginData: LoginRequest = {
    emailOrPhone: '',
    password: ''
  };
  
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'error';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.loginData.emailOrPhone || !this.loginData.password) {
      this.showMessage('Vă rugăm completați toate câmpurile', 'error');
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Autentificare reușită! Vă redirecționăm...', 'success');
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        } else {
          this.showMessage(response.message || 'Eroare la autentificare', 'error');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        this.showMessage('Eroare la conectare. Verificați datele introduse.', 'error');
        this.loading = false;
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
