/**
 * Tool MCP pentru verificarea stării sistemului de autentificare
 */

import { z } from 'zod';
import { AuthAPI } from '../utils/api.js';
import { FileSystemUtils } from '../utils/filesystem.js';
import { AuthSystemStatus } from '../types/auth.js';

// Schema pentru validarea input-ului
export const CheckAuthStatusSchema = z.object({
  detailed: z.boolean().optional().default(false),
  include_tests: z.boolean().optional().default(false)
});

export type CheckAuthStatusInput = z.infer<typeof CheckAuthStatusSchema>;

/**
 * Verifică starea completă a sistemului de autentificare
 */
export async function checkAuthStatus(args: CheckAuthStatusInput): Promise<{
  success: boolean;
  status: AuthSystemStatus;
  details?: any;
  tests?: any;
}> {
  const authAPI = new AuthAPI();
  const filesystem = new FileSystemUtils();
  
  const status: AuthSystemStatus = {
    api_health: false,
    database_connection: false,
    jwt_secret_configured: false,
    cors_enabled: false,
    tables_exist: false,
    last_check: new Date().toISOString(),
    api_url: 'https://api.misedainspectsrl.ro/api/'
  };

  let details: any = {};
  let tests: any = null;

  try {
    // 1. Verifică starea API-ului
    const healthCheck = await authAPI.checkHealthStatus();
    status.api_health = healthCheck.healthy;
    
    if (args.detailed) {
      details.api_health = {
        healthy: healthCheck.healthy,
        message: healthCheck.message,
        response_time: healthCheck.response_time
      };
    }

    // 2. Verifică configurația JWT (prin citirea fișierului auth.php)
    try {
      const authConfig = await filesystem.readConfigurationFile('api');
      if (authConfig.readable && authConfig.content.includes('JWT_SECRET')) {
        status.jwt_secret_configured = true;
        
        if (args.detailed) {
          details.jwt_config = {
            file_exists: authConfig.exists,
            secret_defined: authConfig.content.includes('define(\'JWT_SECRET\''),
            using_default: authConfig.content.includes('change-this-in-production')
          };
        }
      }
    } catch (error) {
      if (args.detailed) {
        details.jwt_config = {
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    // 3. Verifică configurația CORS
    try {
      const corsConfig = await filesystem.readConfigurationFile('cors');
      status.cors_enabled = corsConfig.readable && corsConfig.content.includes('Access-Control-Allow-Origin');
      
      if (args.detailed) {
        details.cors_config = {
          file_exists: corsConfig.exists,
          cors_headers_found: corsConfig.content.includes('Access-Control-Allow-Origin')
        };
      }
    } catch (error) {
      if (args.detailed) {
        details.cors_config = {
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    // 4. Verifică schema bazei de date
    try {
      const schema = await filesystem.readDatabaseSchema();
      status.tables_exist = schema.readable && 
        schema.content.includes('CREATE TABLE') && 
        schema.content.includes('users') &&
        schema.content.includes('password_resets');
      
      if (args.detailed) {
        details.database_schema = {
          file_exists: schema.exists,
          users_table: schema.content.includes('CREATE TABLE IF NOT EXISTS users'),
          password_resets_table: schema.content.includes('password_resets'),
          indexes_defined: schema.content.includes('INDEX')
        };
      }
    } catch (error) {
      if (args.detailed) {
        details.database_schema = {
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    // 5. Verifică integritatea proiectului
    if (args.detailed) {
      const integrity = await filesystem.checkProjectIntegrity();
      details.project_integrity = integrity;
    }

    // 6. Rulează teste complete dacă este cerut
    if (args.include_tests) {
      tests = await authAPI.runFullApiTest();
      
      // Actualizează starea bazată pe teste
      if (tests.overall_health) {
        status.database_connection = true;
      }
    }

    // Determină starea generală
    const overallHealthy = status.api_health && 
                          status.jwt_secret_configured && 
                          status.cors_enabled && 
                          status.tables_exist;

    return {
      success: true,
      status,
      ...(args.detailed && { details }),
      ...(args.include_tests && { tests })
    };

  } catch (error) {
    return {
      success: false,
      status: {
        ...status,
        last_check: new Date().toISOString()
      },
      details: {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    };
  }
}

/**
 * Metadatele pentru tool-ul MCP
 */
export const checkAuthStatusTool = {
  name: 'check_auth_status',
  description: 'Verifică starea completă a sistemului de autentificare MiseNoti, inclusiv API health, configurația JWT, CORS și schema bazei de date',
  inputSchema: {
    type: 'object',
    properties: {
      detailed: {
        type: 'boolean',
        description: 'Returnează informații detaliate despre fiecare componentă verificată',
        default: false
      },
      include_tests: {
        type: 'boolean',
        description: 'Rulează teste complete pe API pentru validarea funcționalității',
        default: false
      }
    },
    additionalProperties: false
  }
} as const;