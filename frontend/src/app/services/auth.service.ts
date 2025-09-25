import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { 
  AuthResponse, 
  AuthState, 
  User, 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest,
  ResetPasswordRequest 
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://www.misedainspectsrl.ro/api';
  private currentUserSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });
  
  public currentUser$ = this.currentUserSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    if (typeof localStorage === 'undefined') return;
    
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    
    if (token && user) {
      this.currentUserSubject.next({
        isAuthenticated: true,
        token: token,
        user: JSON.parse(user)
      });
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth.php`, {
      action: 'login',
      ...credentials
    }, this.httpOptions).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.setAuthData(response.token, response.user);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth.php`, {
      action: 'register',
      ...userData
    }, this.httpOptions);
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth.php`, {
      action: 'forgot_password',
      ...data
    }, this.httpOptions);
  }

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth.php`, {
      action: 'reset_password',
      ...data
    }, this.httpOptions);
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    this.currentUserSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  private setAuthData(token: string, user: User): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
    
    this.currentUserSubject.next({
      isAuthenticated: true,
      token: token,
      user: user
    });
  }

  get currentUserValue(): AuthState {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value.isAuthenticated;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.currentUserValue.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
}
