# MiseNoti - Setup Guide

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (for Angular frontend and MCP server)
- **PHP** 8.4+ (for backend API)
- **MySQL** 8.4+ (for database)
- **Git** (for version control)

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/aduadu321/MiseNoti.git
cd MiseNoti
```

2. **Install Dependencies**
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..

# MCP Server dependencies
cd mcp-server
npm install
cd ..
```

3. **Database Setup**
```bash
# Import database schema
mysql -u your_user -p your_database < backend/database-auth.sql

# Update database configuration
# Edit backend/config/database.php with your credentials
```

4. **Configuration**
```bash
# Update backend configuration
cp backend/config/database.php.example backend/config/database.php

# Edit database credentials in database.php
```

### Development Commands

```bash
# Start all services (frontend, backend, mcp-server)
npm run dev

# Build for production
npm run build:all

# Deploy to production
npm run deploy
```

### Branch Structure

- **main** - Stable release branch
- **frontend-angular** - Angular frontend development
- **backend-php** - PHP backend API development
- **mcp-server** - MCP Server development
- **deployment** - Production deployment files

### GitHub OAuth Setup

1. Create GitHub OAuth App at: https://github.com/settings/applications/new
2. Set Authorization callback URL to: `http://localhost:4200/auth/github/callback`
3. Update client ID in `frontend/src/environments/environment.ts`

### MCP Server Integration

1. Build MCP server: `cd mcp-server && npm run build`
2. Configure VS Code MCP: Add to `.vscode/mcp.json`
3. Test with GitHub Copilot Chat

## 📁 Project Structure

```
MiseNoti/
├── frontend/           # Angular 20.3.2 application
├── backend/            # PHP 8.4 API with MySQL
├── mcp-server/         # TypeScript MCP server
├── deployment/         # Production build files
├── docs/              # Documentation
└── .github/           # GitHub configuration
```

## 🔧 Configuration Files

- `package.json` - Root dependencies and scripts
- `build-production.ps1` - Windows build script
- `DEPLOYMENT-README.md` - Deployment instructions
- `MCP-AUTH-SERVER-GUIDE.md` - MCP server guide

## 📞 Support

For support and questions, contact MISEDAINSPECTSRL development team.