/**
 * Tool MCP pentru crearea de conturi noi
 */

import { z } from 'zod';
import { AuthAPI } from '../utils/api.js';
import { CreateUserRequest } from '../types/auth.js';

// Schema pentru validarea input-ului
export const CreateUserAccountSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă minimum 2 caractere'),
  surname: z.string().min(2, 'Prenumele trebuie să aibă minimum 2 caractere'),
  contactType: z.enum(['email', 'phone'], {
    description: 'Tipul de contact pentru verificare'
  }),
  email: z.string().email('Email invalid').optional(),
  phone: z.string().regex(/^(\+4|0)[0-9]{9}$/, 'Format telefon invalid (ex: 0722123456)').optional(),
  password: z.string().min(6, 'Parola trebuie să aibă minimum 6 caractere'),
  confirmPassword: z.string().min(6, 'Confirmarea parolei trebuie să aibă minimum 6 caractere'),
  step: z.enum(['1', '2']).optional().default('1'),
  verificationCode: z.string().optional()
}).refine((data) => {
  // Verifică că parolele coincid
  return data.password === data.confirmPassword;
}, {
  message: 'Parolele nu coincid',
  path: ['confirmPassword']
}).refine((data) => {
  // Verifică că este specificat email-ul sau telefonul în funcție de contactType
  if (data.contactType === 'email') {
    return data.email && data.email.length > 0;
  } else {
    return data.phone && data.phone.length > 0;
  }
}, {
  message: 'Specificați email-ul pentru contactType=email sau telefonul pentru contactType=phone',
  path: ['email', 'phone']
});

export type CreateUserAccountInput = z.infer<typeof CreateUserAccountSchema>;

/**
 * Creează un cont nou de utilizator
 */
export async function createUserAccount(args: CreateUserAccountInput): Promise<{
  success: boolean;
  message: string;
  step?: '1' | '2';
  user_id?: number;
  user?: any;
  next_action?: string;
  validation_errors?: string[];
}> {
  try {
    // Validează input-ul
    const validatedArgs = CreateUserAccountSchema.parse(args);
    
    const authAPI = new AuthAPI();
    
    // Pregătește datele pentru API-ul PHP
    const userData: CreateUserRequest = {
      nume: validatedArgs.name,
      prenume: validatedArgs.surname,
      contactType: validatedArgs.contactType,
      email: validatedArgs.email,
      phone: validatedArgs.phone,
      password: validatedArgs.password,
      confirmPassword: validatedArgs.confirmPassword,
      step: validatedArgs.step,
      verificationCode: validatedArgs.verificationCode
    };

    if (validatedArgs.step === '1') {
      // Pasul 1: Trimite codul de verificare
      const response = await authAPI.createUserAccount(userData);
      
      if (response.success) {
        return {
          success: true,
          message: response.message,
          step: '1',
          next_action: 'Introduceți codul de verificare 000000 pentru a finaliza înregistrarea'
        };
      } else {
        return {
          success: false,
          message: response.message,
          step: '1'
        };
      }
    } else {
      // Pasul 2: Verifică codul și creează contul
      if (!validatedArgs.verificationCode) {
        return {
          success: false,
          message: 'Codul de verificare este obligatoriu pentru pasul 2',
          validation_errors: ['Codul de verificare lipsește']
        };
      }

      const response = await authAPI.createUserAccount(userData);
      
      if (response.success) {
        return {
          success: true,
          message: response.message,
          step: '2',
          user_id: response.user?.id,
          user: response.user,
          next_action: 'Cont creat cu succes! Puteți să vă autentificați acum.'
        };
      } else {
        return {
          success: false,
          message: response.message,
          step: '2'
        };
      }
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Erori de validare
      const validationErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      
      return {
        success: false,
        message: 'Date de intrare invalide',
        validation_errors: validationErrors
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Eroare necunoscută la crearea contului'
    };
  }
}

/**
 * Helper pentru crearea rapidă a unui cont de test
 */
export async function createTestAccount(emailOrPhone: string, isEmail: boolean = true): Promise<{
  success: boolean;
  message: string;
  account_details?: any;
}> {
  try {
    const contactType = isEmail ? 'email' : 'phone';
    const baseData = {
      name: 'Test',
      surname: 'User',
      contactType,
      password: 'test123',
      confirmPassword: 'test123'
    };

    const userData = isEmail 
      ? { ...baseData, email: emailOrPhone }
      : { ...baseData, phone: emailOrPhone };

    // Pasul 1: Trimite codul
    const step1Result = await createUserAccount({ ...userData, step: '1' } as CreateUserAccountInput);
    
    if (!step1Result.success) {
      return {
        success: false,
        message: `Pasul 1 eșuat: ${step1Result.message}`
      };
    }

    // Pasul 2: Verifică cu codul de test
    const step2Result = await createUserAccount({ 
      ...userData, 
      step: '2', 
      verificationCode: '000000' 
    } as CreateUserAccountInput);

    return {
      success: step2Result.success,
      message: step2Result.message,
      account_details: step2Result.user
    };

  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Eroare la crearea contului de test'
    };
  }
}

/**
 * Metadatele pentru tool-ul MCP
 */
export const createUserAccountTool = {
  name: 'create_user_account',
  description: 'Creează un cont nou de utilizator în sistemul MiseNoti cu proces de verificare în 2 pași (email/telefon + cod de verificare)',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Numele utilizatorului (minimum 2 caractere)',
        minLength: 2
      },
      surname: {
        type: 'string', 
        description: 'Prenumele utilizatorului (minimum 2 caractere)',
        minLength: 2
      },
      contactType: {
        type: 'string',
        enum: ['email', 'phone'],
        description: 'Tipul de contact pentru verificare'
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Adresa de email (obligatorie dacă contactType=email)'
      },
      phone: {
        type: 'string',
        pattern: '^(\\+4|0)[0-9]{9}$',
        description: 'Numărul de telefon românesc (obligatoriu dacă contactType=phone)'
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'Parola contului (minimum 6 caractere)'
      },
      confirmPassword: {
        type: 'string',
        minLength: 6,
        description: 'Confirmarea parolei (trebuie să coincidă cu password)'
      },
      step: {
        type: 'string',
        enum: ['1', '2'],
        default: '1',
        description: 'Pasul procesului: 1=trimite cod, 2=verifică cod și creează cont'
      },
      verificationCode: {
        type: 'string',
        description: 'Codul de verificare primit (obligatoriu pentru step=2, folosiți 000000 pentru testare)'
      }
    },
    required: ['name', 'surname', 'contactType', 'password', 'confirmPassword'],
    additionalProperties: false
  }
} as const;