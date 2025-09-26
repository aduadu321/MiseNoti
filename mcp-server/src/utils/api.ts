/**
 * Utilități pentru comunicarea cu backend-ul PHP de autentificare
 */

import { AuthResponse, CreateUserRequest, ValidateCredentialsRequest, ResetPasswordRequest } from '../types/auth.js';

export class AuthAPI {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(baseUrl = 'https://api.misedainspectsrl.ro/api/', timeout = 10000) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    this.timeout = timeout;
  }

  /**
   * Efectuează o cerere HTTP cu timeout și error handling
   */
  private async makeRequest(endpoint: string, data: any): Promise<AuthResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result as AuthResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout după ${this.timeout}ms`);
        }
        throw new Error(`API Error: ${error.message}`);
      }
      
      throw new Error('Unknown API error');
    }
  }

  /**
   * Verifică starea API-ului
   */
  async checkHealthStatus(): Promise<{ healthy: boolean; message: string; response_time?: number }> {
    const startTime = Date.now();
    
    try {
      const response = await this.makeRequest('auth.php', { action: 'health_check' });
      const responseTime = Date.now() - startTime;
      
      return {
        healthy: true,
        message: 'API is responding',
        response_time: responseTime
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Creează un cont de utilizator nou
   */
  async createUserAccount(userData: CreateUserRequest): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('auth.php', {
        action: 'register',
        ...userData
      });
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Eroare la crearea contului'
      };
    }
  }

  /**
   * Validează credențialele utilizatorului
   */
  async validateCredentials(credentials: ValidateCredentialsRequest): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('auth.php', {
        action: 'login',
        ...credentials
      });
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Eroare la validarea credențialelor'
      };
    }
  }

  /**
   * Inițiază procesul de resetare a parolei
   */
  async initiateForgotPassword(emailOrPhone: string): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('auth.php', {
        action: 'forgot_password',
        emailOrPhone
      });
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Eroare la inițierea resetării parolei'
      };
    }
  }

  /**
   * Resetează parola cu token-ul primit
   */
  async resetPassword(resetData: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('auth.php', {
        action: 'reset_password',
        ...resetData
      });
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Eroare la resetarea parolei'
      };
    }
  }

  /**
   * Testează toate endpoint-urile API
   */
  async runFullApiTest(): Promise<{ 
    overall_health: boolean; 
    tests: Array<{ name: string; success: boolean; message: string; duration?: number }> 
  }> {
    const tests = [];
    let overallHealth = true;

    // Test 1: Health check
    const healthStart = Date.now();
    const healthCheck = await this.checkHealthStatus();
    tests.push({
      name: 'API Health Check',
      success: healthCheck.healthy,
      message: healthCheck.message,
      duration: Date.now() - healthStart
    });

    if (!healthCheck.healthy) {
      overallHealth = false;
    }

    // Test 2: Invalid credentials test
    const loginStart = Date.now();
    const loginTest = await this.validateCredentials({
      emailOrPhone: 'test@invalid.com',
      password: 'wrong_password'
    });
    tests.push({
      name: 'Invalid Login Test',
      success: !loginTest.success, // Așteptăm să eșueze
      message: loginTest.success ? 'Unexpected success' : 'Expected failure - OK',
      duration: Date.now() - loginStart
    });

    return {
      overall_health: overallHealth,
      tests
    };
  }
}