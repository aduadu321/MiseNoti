# Instrucțiuni Specifice pentru Frontend Angular

## Verificări pentru Componente Angular

### Standalone Components
- Verifică că toate componentele folosesc `standalone: true`
- Controlează că imports sunt declarate corect în decorator
- Asigură-te că nu există dependențe nedeclarate

### Reactive Forms
- Verifică că FormBuilder și Validators sunt importate
- Controlează că validările sunt implementate corect
- Asigură-te că error messages sunt în română

### Routing și Navigation
- Verifică că toate rutele sunt definite în app.routes.ts
- Controlează că lazy loading funcționează corect
- Asigură-te că navigation guards sunt implementate pentru rute protejate

### Services și HTTP
- Verifică că AuthService folosește proper error handling
- Controlează că HTTP interceptors sunt configurați
- Asigură-te că Observable streams sunt proper managed

### Templates și Styling
- Verifică că template-urile sunt accesibile (aria-labels, etc.)
- Controlează că CSS-ul este responsive
- Asigură-te că loading states sunt implementate

### Performance
- Verifică că OnPush change detection este folosită când e posibil
- Controlează că subscription-urile sunt proper unsubscribed
- Asigură-te că trackBy functions sunt folosite în *ngFor
