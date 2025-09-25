# Instrucțiuni Specifice pentru Backend PHP

## Verificări pentru API PHP

### Securitate
- Verifică că toate input-urile sunt sanitizate și validate
- Controlează că parolele sunt hash-uite cu password_hash()
- Asigură-te că JWT tokens sunt generate și verificate securizat
- Verifică că există protecție împotriva SQL injection

### Structura API
- Verifică că endpoint-urile respectă principiile REST
- Controlează că response-urile au format JSON consistent
- Asigură-te că status codes HTTP sunt folosite corect
- Verifică că există proper error handling și logging

### Database Operations
- Verifică că prepared statements sunt folosite pentru toate queries
- Controlează că connection pooling este implementat eficient
- Asigură-te că tranzacțiile sunt folosite pentru operații complexe
- Verifică că indexii database sunt definiți corect

### CORS și Headers
- Verifică că CORS headers sunt setate corect
- Controlează că Content-Type headers sunt specificate
- Asigură-te că security headers sunt implementate

### Performance
- Verifică că query-urile sunt optimizate
- Controlează că există caching unde e apropiat
- Asigură-te că file uploads sunt handled securizat
- Verifică că există rate limiting pentru API calls

### Error Handling
- Verifică că toate excepțiile sunt caught și logged
- Controlează că error messages nu expun informații sensibile
- Asigură-te că există proper fallback mechanisms
