# Guía de Autenticación JWT

Este documento explica cómo funciona el sistema de autenticación JWT en InfoVoto Peru API.

## Configuración

### Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRES_IN=24h
```

**IMPORTANTE**: Usa una clave secreta fuerte en producción. Puedes generar una con:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Cómo Funciona

### 1. Guard Global con @Public

Todos los endpoints están protegidos por defecto con `JwtAuthGuard`. Para marcar un endpoint como público (sin autenticación), usa el decorador `@Public()`:

```typescript
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Get()
findAll() {
  // Este endpoint no requiere autenticación
}
```

### 2. Login

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "tu_contraseña"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Acceder a Endpoints Protegidos

Incluye el token en el header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Obtener Usuario Autenticado

En cualquier endpoint protegido, puedes acceder al usuario actual usando el decorador `@Request()`:

```typescript
import { Request } from '@nestjs/common';

@Get('profile')
getProfile(@Request() req) {
  return req.user; // Contiene: { userId, email, role }
}
```

## Endpoints Públicos (No requieren autenticación)

### Autenticación y Registro
- `POST /auth/login` - Login
- `POST /voters/pre-register` - Pre-registrar votante con DNI
- `POST /users/register-email` - Registrar email
- `POST /users/activate-account` - Activar cuenta
- `POST /users/resend-activation/:email` - Reenviar token

### Consulta de Información Electoral (Solo GET)
- `GET /elections` - Listar elecciones
- `GET /elections/:id` - Obtener elección
- `GET /political-groups` - Listar partidos políticos
- `GET /political-groups/:id` - Obtener partido
- `GET /candidates` - Listar candidatos
- `GET /candidates/:id` - Obtener candidato

## Endpoints Protegidos (Requieren autenticación)

Todos los demás endpoints requieren autenticación:

### Escritura de Datos
- `POST /political-groups` - Crear partido
- `PATCH /political-groups/:id` - Actualizar partido
- `DELETE /political-groups/:id` - Eliminar partido
- `POST /candidates` - Crear candidato
- `PATCH /candidates/:id` - Actualizar candidato
- `DELETE /candidates/:id` - Eliminar candidato
- `POST /posts` - Crear post
- `POST /comments` - Crear comentario
- etc.

### Operaciones de Usuario
- `GET /auth/profile` - Ver perfil del usuario autenticado
- `GET /users` - Listar usuarios
- `PATCH /users/:id` - Actualizar usuario
- etc.

## Swagger UI

La documentación Swagger incluye soporte para autenticación JWT:

1. Ve a `http://localhost:3000/documentation`
2. Haz clic en el botón **Authorize** (candado verde)
3. Ingresa el token en el formato: `Bearer eyJhbGciOiJIUzI1...`
4. Haz clic en **Authorize**
5. Ahora puedes probar los endpoints protegidos

## Flujo Completo de Registro y Login

### 1. Pre-registro (Público)
```bash
POST /voters/pre-register
{
  "documentNumber": "12345678",
  "birthDate": "1990-01-15",
  "votingTableId": 1
}
```

### 2. Registrar Email (Público)
```bash
POST /users/register-email
{
  "documentNumber": "12345678",
  "email": "usuario@example.com"
}
```

Se envía un email con el token de activación.

### 3. Activar Cuenta (Público)
```bash
POST /users/activate-account
{
  "token": "abc123...",
  "password": "MiPasswordSeguro123!"
}
```

### 4. Login (Público)
```bash
POST /auth/login
{
  "email": "usuario@example.com",
  "password": "MiPasswordSeguro123!"
}
```

Respuesta:
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1..."
  }
}
```

### 5. Usar el Token en Requests

```bash
GET /auth/profile
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1...
```

## Seguridad

### Mejores Prácticas

1. **Nunca compartas tu JWT_SECRET**: Guárdalo de forma segura en variables de entorno
2. **HTTPS en Producción**: Siempre usa HTTPS para transmitir tokens
3. **Tokens de Corta Duración**: Configura `JWT_EXPIRES_IN` apropiadamente (ej: 1h, 24h)
4. **Validación de Contraseñas**: Usa contraseñas fuertes (mínimo 8 caracteres)
5. **Rate Limiting**: Implementa límites de intentos de login

### Manejo de Errores

**401 Unauthorized**: Token inválido, expirado o no proporcionado
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden**: Token válido pero sin permisos
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

## Testing con cURL

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"password123"}'
```

### Usar Token
```bash
TOKEN="eyJhbGciOiJIUzI1..."

curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

### Error: "JWT_SECRET no está definido"
- Verifica que `.env` esté en la raíz del proyecto
- Asegúrate de que `JWT_SECRET` esté definido en `.env`

### Error: "Token malformado"
- Verifica que el header sea: `Authorization: Bearer TOKEN`
- No incluyas comillas ni espacios extras

### Error: "Token expirado"
- El token ha caducado según `JWT_EXPIRES_IN`
- Haz login nuevamente para obtener un nuevo token
