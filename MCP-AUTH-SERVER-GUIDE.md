# MCP Auth Server - Test Guide

## Server Status

✅ **Server Built**: `mcp-server/build/index.js` - TypeScript compiled successfully
✅ **Server Running**: MCP Auth Server started without errors
✅ **GitHub Copilot Chat**: Extension installed and available

## Configuration Files

- **MCP Config**: `.vscode/mcp.json` - VS Code MCP server registration
- **Package Config**: `mcp-server/package.json` - Dependencies and scripts
- **TypeScript Config**: `mcp-server/tsconfig.json` - Compilation settings

## Available MCP Tools

### 1. **check_auth_status**

- **Purpose**: System health monitoring
- **Usage**: Check authentication system status
- **Returns**: API health, database connection, security features status

### 2. **create_user_account**

- **Purpose**: New user registration
- **Parameters**: `name`, `email`, `phone`, `password`
- **Usage**: Register new users in the system
- **Returns**: Success/failure status with user details

### 3. **validate_credentials**

- **Purpose**: Login verification
- **Parameters**: `emailOrPhone`, `password`
- **Usage**: Validate user login credentials
- **Returns**: Authentication result and token information

### 4. **reset_user_password**

- **Purpose**: Password reset initiation
- **Parameters**: `emailOrPhone`
- **Usage**: Start password reset process for users
- **Returns**: Reset status and instructions

### 5. **get_project_structure**

- **Purpose**: Project organization overview
- **Usage**: Display complete project architecture
- **Returns**: Frontend, backend, deployment structure details

### 6. **read_auth_config**

- **Purpose**: Configuration file access
- **Parameters**: `configType` (database/api/frontend)
- **Usage**: Read authentication system configuration files
- **Returns**: Configuration content based on type

## How to Test MCP Server

### Method 1: GitHub Copilot Chat Integration

1. Open GitHub Copilot Chat (Ctrl+Alt+I)
2. Use natural language to ask about authentication:
   - "Check the auth system status"
   - "Create a new user account for testing"
   - "Show me the project structure"
   - "Read the database configuration"

### Method 2: MCP Inspector (Development)

```bash
# Install MCP Inspector globally
npm install -g @modelcontextprotocol/inspector

# Test the server directly
npx @modelcontextprotocol/inspector mcp-server/build/index.js
```

### Method 3: Manual Server Test

```bash
# Start the server manually
cd mcp-server
node build/index.js

# The server will wait for JSON-RPC messages via stdio
# Use tools like curl or postman to send MCP protocol messages
```

## API Integration

- **Backend API**: `https://api.misedainspectsrl.ro/api/`
- **Auth Endpoint**: `auth.php`
- **CORS**: Configured for cross-origin requests
- **Security**: JWT tokens, password hashing, SQL injection protection

## Project Files Access

The MCP server can read local project files:

- `backend/database-auth.sql` - Database schema
- `backend/config/database.php` - DB configuration
- `backend/api/auth.php` - Authentication API
- `backend/config/cors.php` - CORS settings
- `frontend/src/app/services/auth.service.ts` - Frontend auth service

## Next Steps for Full Integration

1. **Test with GitHub Copilot Chat** - Use natural language commands
2. **Validate API Connections** - Ensure backend API is accessible
3. **Test User Operations** - Create, validate, reset user accounts
4. **Monitor System Health** - Regular auth status checks
5. **Review Configuration** - Database and API settings

## Troubleshooting

- **Server Not Starting**: Check `node build/index.js` for errors
- **MCP Not Recognized**: Restart VS Code after creating `.vscode/mcp.json`
- **API Errors**: Verify `api.misedainspectsrl.ro` is accessible
- **TypeScript Errors**: Run `npm run build` to recompile

## Development Commands

```bash
cd mcp-server

# Build the server
npm run build

# Start in development mode
npm run dev

# Install dependencies
npm install
```

MCP Auth Server este acum configurat și funcțional pentru integrarea cu GitHub Copilot Chat și alte aplicații AI!