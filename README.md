# 🚗 MiseNoti - Sistem Complete de Inspecție și Control pentru Autovehicule

## 📋 Descriere

**MiseNoti** este o aplicație web modernă pentru gestionarea inspecțiilor tehnice auto, dezvoltată cu tehnologii de vârf pentru a oferi o experiență completă utilizatorilor și administratorilor.

## 🛠️ Stack Tehnologic

### Frontend
- **Angular 20.3.2** - Framework modern pentru interfața utilizatorului
- **TypeScript** - Pentru dezvoltare type-safe
- **Standalone Components** - Arhitectură modulară
- **Responsive Design** - Optimizat pentru toate dispozitivele

### Backend & APIs
- **PHP 8.4.11** - Server-side processing
- **MySQL 8.4.11 / MariaDB 11.4.8** - Baza de date
- **Node.js Mock Backend** - Pentru dezvoltare și testare
- **RESTful APIs** - Comunicare eficientă client-server

### Autentificare & Securitate
- **GitHub OAuth Integration** - Autentificare prin GitHub
- **JWT Tokens** - Sesiuni securizate
- **SMS Verification** - Verificare în două etape
- **MCP Server** - Model Context Protocol pentru integrări avansate

### Deployment
- **Production Ready** - Optimizat pentru hosting web
- **Static Site Generation** - Performance maxim
- **Cross-Browser Compatibility** - Compatibilitate completă

## ✨ Funcționalități

### 🔐 Sistem de Autentificare
- [x] **Înregistrare utilizatori** cu validare completă
- [x] **Login clasic** cu email/parolă
- [x] **GitHub OAuth** - autentificare cu GitHub
- [x] **SMS Verification** - cod de verificare
- [x] **JWT Token Management** - sesiuni securizate
- [x] **Recuperare parolă** - reset prin email

### 👤 Profil Utilizator
- [x] **Date personale** - nume, prenume, contact
- [x] **Informații autovehicul** - marcă, model, an fabricație
- [x] **Tip combustibil** - benzină, motorină, hibrid, electric
- [x] **Număr înmatriculare** - validare format RO
- [x] **Edit inline** - modificare date în timp real

### 📅 Programare Inspecții
- [x] **Programare online** - selectare dată și oră
- [x] **Istoric programări** - toate programările anterioare
- [x] **Status tracking** - urmărirea stării programării
- [x] **Notificări** - reminder-uri automate

### 🔧 Servicii Available
- [x] **Inspecție tehnică periodică** - ITP standard
- [x] **Inspecții RAR** - verificări specifice
- [x] **Teste de emisii** - control poluare
- [x] **Verificări tehnice** - diverse tipuri de teste

### 🏢 Pentru Administratori
- [x] **Dashboard management** - control complet
- [x] **Gestionare utilizatori** - CRUD operații
- [x] **Rapoarte** - statistici și analize
- [x] **Configurări sistem** - setări globale

## 🚀 Instalare și Configurare

### Cerințe de sistem
- Node.js 18+ 
- PHP 8.4+
- MySQL 8.4+ / MariaDB 11.4+
- Git

### 1. Clonează repository-ul
\`\`\`bash
git clone https://github.com/aduadu321/MiseNoti.git
cd MiseNoti
\`\`\`

### 2. Frontend Setup
\`\`\`bash
cd frontend
npm install
ng build
\`\`\`

### 3. Backend Setup
\`\`\`bash
# Configurează conexiunea la baza de date
cp backend/config/database.sample.php backend/config/database.php
# Editează credențialele de bază de date

# Importă structura bazei de date
mysql -u root -p < backend/database.sql
\`\`\`

### 4. MCP Server Setup
\`\`\`bash
cd mcp-server
npm install
npm run build
npm start
\`\`\`

### 5. Mock Backend (pentru dezvoltare)
\`\`\`bash
cd mock-backend
npm install
node server.js
\`\`\`

## ⚙️ Configurare GitHub OAuth

### 1. Creează GitHub OAuth App
1. Mergi la GitHub Settings > Developer settings > OAuth Apps
2. Creează o nouă aplicație OAuth
3. Setează callback URL: \`http://your-domain.com/auth/github/callback\`

### 2. Configurează credențialele
\`\`\`typescript
// În frontend/src/app/components/auth/register/register.component.ts
private githubClientId = 'your-client-id';
private githubClientSecret = 'your-client-secret';
\`\`\`

## 🔧 MCP Server Configuration

MCP Server-ul oferă integrare avansată cu GitHub și alte servicii:

\`\`\`typescript
// Pornește MCP Server
npm start

// Available tools:
- github_oauth_init
- github_oauth_callback  
- send_sms_verification
- verify_sms_code
- generate_jwt_token
\`\`\`

## 📁 Structura Proiectului

\`\`\`
MiseNoti/
├── 📂 frontend/                 # Angular application
│   ├── 📂 src/app/components/   # UI Components
│   ├── 📂 src/app/services/     # Business logic
│   └── 📂 dist/                 # Build output
├── 📂 backend/                  # PHP Backend
│   ├── 📂 api/                  # REST endpoints
│   ├── 📂 config/               # Configuration
│   └── 📄 database.sql          # DB schema
├── 📂 mcp-server/              # MCP Integration
│   ├── 📂 src/                  # TypeScript source
│   └── 📂 build/                # Compiled JS
├── 📂 mock-backend/            # Development server
├── 📂 deployment/              # Production files
└── 📄 README.md                # This file
\`\`\`

## 🌐 Demo & URLs

- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Mock Backend**: [http://localhost:3001](http://localhost:3001)
- **MCP Server**: stdio (Model Context Protocol)

### Pagini disponibile
- 🏠 **Home**: Pagina principală
- 👤 **Login/Register**: Autentificare
- 👨‍💼 **Profile**: Configurare date utilizator
- 📅 **Programare**: Programează inspecții
- 🔧 **Servicii**: Vezi serviciile disponibile
- 🧪 **Teste**: Tipuri de teste disponibile
- 📞 **Contact**: Informații de contact

## 🤝 Contribuții

1. Fork repository-ul
2. Creează o branch nouă: \`git checkout -b feature/amazing-feature\`
3. Commit modificările: \`git commit -m 'Add amazing feature'\`
4. Push pe branch: \`git push origin feature/amazing-feature\`
5. Deschide un Pull Request

## 📝 Licență

Acest proiect este licențiat sub licența MIT - vezi fișierul [LICENSE](LICENSE) pentru detalii.

## 📞 Contact & Support

- **Email**: contact@misenoti.ro
- **Website**: [https://misenoti.ro](https://misenoti.ro)
- **GitHub**: [https://github.com/aduadu321/MiseNoti](https://github.com/aduadu321/MiseNoti)

## 🔗 Links Utile

- [Angular Documentation](https://angular.io/docs)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

**Made with ❤️ for MISEDAINSPECTSRL**

*Sistem complet de inspecție și control pentru autovehicule - tehnologie modernă, siguranță maximă.*