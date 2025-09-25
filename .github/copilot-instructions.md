# GitHub Copilot Instructions pentru MISEDAINSPECTSRL

## Instrucțiuni Generale pentru Code Review

### Limba și Comunicare
- Când efectuezi code review, răspunde **în română**.
- Folosește terminologie tehnică românească când este posibilă.
- Explică conceptele complexe în mod clar și accesibil.

### Focus pe Securitate
- Când efectuezi code review, aplică verificările din `/security/security-checklist.md`.
- Verifică vulnerabilitățile de securitate în sistemul de autentificare.
- Asigură-te că parolele sunt hash-uite corect și token-urile JWT sunt securizate.
- Controlează validarea input-ului pentru a preveni SQL injection și XSS.

### Standarde de Cod
- Când efectuezi code review, focalizează-te pe **lizibilitate** și evită operatorii ternari imbricați.
- Verifică consistența stilului de cod între Angular și PHP.
- Asigură-te că numele variabilelor și funcțiilor sunt descriptive.
- Controlează că comentariile sunt în română și actualizate.

### Arhitectură și Performance
- Verifică că componentele Angular folosesc standalone architecture corect.
- Controlează că API-urile PHP respectă principiile REST.
- Asigură-te că query-urile de bază de date sunt optimizate.
- Verifică că există proper error handling în toate layere-le.

### Specificații Proiect MISEDAINSPECTSRL
- Verifică că toate endpoint-urile de autentificare funcționează corect.
- Controlează că sistemul de înregistrare în 2 pași este implementat securizat.
- Asigură-te că integrarea OAuth GitHub funcționează proper.
- Verifică că toate componentele Angular au proper routing și navigation.

### Deployment și Producție
- Controlează că fișierele de deployment sunt optimizate pentru producție.
- Verifică că configurația CORS este setată corect pentru domeniul live.
- Asigură-te că toate credențialele sensibile sunt externalizate în variabile de mediu.
- Controlează că build-ul Angular este optimizat și minificat.

## Priority Areas pentru Review

1. **Securitate Autentificare** - JWT tokens, password hashing, session management
2. **Validare Input** - Form validation, API input sanitization
3. **Error Handling** - Proper error messages și logging
4. **Performance** - Database queries, Angular change detection
5. **Accesibilitate** - Form labels, screen reader compatibility
6. **Mobile Responsiveness** - CSS media queries, touch interactions