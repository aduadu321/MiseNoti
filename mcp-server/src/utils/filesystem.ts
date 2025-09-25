/**
 * Utilități pentru accesarea fișierelor din proiect
 */

import { readFile, access, readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';
import { ProjectStructure, ConfigurationFile } from '../types/auth.js';

export class FileSystemUtils {
  private readonly projectRoot: string;

  constructor(projectRoot?: string) {
    // Determină root-ul proiectului automat dacă nu este specificat
    this.projectRoot = projectRoot || this.findProjectRoot();
  }

  /**
   * Găsește automat root-ul proiectului
   */
  private findProjectRoot(): string {
    // Presupunem că serverul MCP rulează din mcp-server/
    // Prin urmare, root-ul proiectului este ../
    return resolve(process.cwd(), '..');
  }

  /**
   * Verifică dacă un fișier există și poate fi citit
   */
  private async fileExists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Citește conținutul unui fișier în siguranță
   */
  private async readFileSafe(path: string): Promise<string> {
    try {
      const content = await readFile(path, 'utf-8');
      return content;
    } catch (error) {
      throw new Error(`Nu s-a putut citi fișierul ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obține structura completă a proiectului
   */
  async getProjectStructure(): Promise<ProjectStructure> {
    const structure: ProjectStructure = {
      frontend: {
        framework: 'Angular 20.3.2',
        components: [],
        services: [],
        build_output: 'dist/'
      },
      backend: {
        language: 'PHP 8.4',
        api_endpoints: ['auth.php'],
        config_files: ['database.php', 'cors.php'],
        database_schema: 'database-auth.sql'
      },
      mcp_server: {
        language: 'TypeScript',
        tools: [
          'check_auth_status',
          'create_user_account', 
          'validate_credentials',
          'reset_user_password',
          'get_project_structure',
          'read_auth_config'
        ],
        build_output: 'build/'
      },
      deployment: {
        files: [],
        production_ready: false
      }
    };

    try {
      // Verifică frontend
      const frontendPath = join(this.projectRoot, 'frontend');
      if (await this.fileExists(frontendPath)) {
        const componentsPath = join(frontendPath, 'src/app/components');
        if (await this.fileExists(componentsPath)) {
          structure.frontend.components = await this.scanDirectory(componentsPath, '.component.ts');
        }
        
        const servicesPath = join(frontendPath, 'src/app/services');
        if (await this.fileExists(servicesPath)) {
          structure.frontend.services = await this.scanDirectory(servicesPath, '.service.ts');
        }
      }

      // Verifică deployment
      const deploymentPath = join(this.projectRoot, 'deployment');
      if (await this.fileExists(deploymentPath)) {
        structure.deployment.files = await this.scanDirectory(deploymentPath);
        structure.deployment.production_ready = structure.deployment.files.length > 0;
      }

    } catch (error) {
      // Continue cu structura de bază chiar dacă unele părți eșuează
      console.warn('Warning reading project structure:', error);
    }

    return structure;
  }

  /**
   * Scanează un director pentru fișiere specifice
   */
  private async scanDirectory(dirPath: string, extension?: string): Promise<string[]> {
    try {
      const items = await readdir(dirPath);
      const files: string[] = [];

      for (const item of items) {
        const itemPath = join(dirPath, item);
        const stats = await stat(itemPath);
        
        if (stats.isFile()) {
          if (!extension || item.endsWith(extension)) {
            files.push(item);
          }
        } else if (stats.isDirectory()) {
          // Scanare recursivă pentru subdirectoare
          const subFiles = await this.scanDirectory(itemPath, extension);
          files.push(...subFiles.map(file => `${item}/${file}`));
        }
      }

      return files;
    } catch {
      return [];
    }
  }

  /**
   * Citește un fișier de configurare specific
   */
  async readConfigurationFile(configType: 'database' | 'api' | 'frontend' | 'cors'): Promise<ConfigurationFile> {
    const configPaths = {
      database: 'backend/config/database.php',
      api: 'backend/api/auth.php', 
      frontend: 'frontend/src/app/services/auth.service.ts',
      cors: 'backend/config/cors.php'
    };

    const relativePath = configPaths[configType];
    const fullPath = join(this.projectRoot, relativePath);
    
    const exists = await this.fileExists(fullPath);
    let content = '';
    let readable = false;

    if (exists) {
      try {
        content = await this.readFileSafe(fullPath);
        readable = true;
      } catch (error) {
        content = `Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    } else {
      content = 'File does not exist';
    }

    return {
      path: relativePath,
      type: configType,
      content,
      exists,
      readable
    };
  }

  /**
   * Citește schema bazei de date
   */
  async readDatabaseSchema(): Promise<ConfigurationFile> {
    const schemaPath = join(this.projectRoot, 'backend/database-auth.sql');
    const exists = await this.fileExists(schemaPath);
    
    let content = '';
    let readable = false;

    if (exists) {
      try {
        content = await this.readFileSafe(schemaPath);
        readable = true;
      } catch (error) {
        content = `Error reading schema: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    } else {
      content = 'Database schema file not found';
    }

    return {
      path: 'backend/database-auth.sql',
      type: 'database',
      content,
      exists,
      readable
    };
  }

  /**
   * Verifică integritatea fișierelor de proiect
   */
  async checkProjectIntegrity(): Promise<{
    valid: boolean;
    missing_files: string[];
    issues: string[];
  }> {
    const requiredFiles = [
      'backend/api/auth.php',
      'backend/config/database.php',
      'backend/database-auth.sql',
      'mcp-server/package.json'
    ];

    const missingFiles: string[] = [];
    const issues: string[] = [];

    for (const file of requiredFiles) {
      const fullPath = join(this.projectRoot, file);
      if (!(await this.fileExists(fullPath))) {
        missingFiles.push(file);
      }
    }

    // Verificări suplimentare
    try {
      const packageJsonPath = join(this.projectRoot, 'mcp-server/package.json');
      if (await this.fileExists(packageJsonPath)) {
        const packageContent = await this.readFileSafe(packageJsonPath);
        const packageData = JSON.parse(packageContent);
        
        if (!packageData.dependencies?.['@modelcontextprotocol/sdk']) {
          issues.push('MCP SDK dependency missing from package.json');
        }
      }
    } catch (error) {
      issues.push('Could not validate package.json');
    }

    return {
      valid: missingFiles.length === 0 && issues.length === 0,
      missing_files: missingFiles,
      issues
    };
  }
}