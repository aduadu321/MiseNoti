/**
 * Tipuri pentru sistemul de autentificare MiseNoti
 * Compatible cu backend PHP și baza de date MySQL
 */

export interface User {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  debug_token?: string; // Pentru development
}

export interface CreateUserRequest {
  nume: string;
  prenume: string;
  contactType: 'email' | 'phone';
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  step?: '1' | '2';
  verificationCode?: string;
}

export interface ValidateCredentialsRequest {
  emailOrPhone: string;
  password: string;
}

export interface ResetPasswordRequest {
  emailOrPhone?: string;
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface AuthSystemStatus {
  api_health: boolean;
  database_connection: boolean;
  jwt_secret_configured: boolean;
  cors_enabled: boolean;
  tables_exist: boolean;
  last_check: string;
  api_url: string;
}

export interface ProjectStructure {
  frontend: {
    framework: string;
    components: string[];
    services: string[];
    build_output: string;
  };
  backend: {
    language: string;
    api_endpoints: string[];
    config_files: string[];
    database_schema: string;
  };
  mcp_server: {
    language: string;
    tools: string[];
    build_output: string;
  };
  deployment: {
    files: string[];
    production_ready: boolean;
  };
}

export interface ConfigurationFile {
  path: string;
  type: 'database' | 'api' | 'frontend' | 'cors';
  content: string;
  exists: boolean;
  readable: boolean;
}