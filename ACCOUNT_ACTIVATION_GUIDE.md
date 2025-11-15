# Guía de Activación de Cuentas de Usuario

## Descripción General

El sistema implementa un flujo de activación de cuentas para votantes pre-registrados en el sistema. Cada ciudadano peruano con capacidad de voto ya está registrado en la base de datos, pero debe activar su cuenta mediante un proceso de verificación por correo electrónico.

## Flujo de Activación

### 1. Pre-registro del Votante con DNI
Los votantes se pre-registran en el sistema usando su DNI:

**Endpoint**: `POST /voters/pre-register`

**Body**:
```json
{
  "name": "Juan Carlos Pérez García",
  "documentNumber": "12345678",
  "votingTableId": 12  // opcional
}
```

**Respuesta exitosa**:
```json
{
  "statusCode": 201,
  "message": "Votante pre-registrado correctamente. Debe activar su cuenta con email.",
  "success": true,
  "data": {
    "id": 1,
    "userId": 5,
    "documentNumber": "12345678",
    "votingTableId": 12,
    "user": {
      "id": 5,
      "name": "Juan Carlos Pérez García",
      "email": null,
      "role": "VOTER"
    }
  }
}
```

**Proceso interno**:
1. Valida que el DNI no esté registrado
2. Crea un usuario inactivo sin email ni contraseña
3. Crea el perfil de votante asociado al usuario
4. Asigna mesa de votación si se proporciona

### 2. Registro de Email
El votante debe registrar su correo electrónico usando su DNI:

**Endpoint**: `POST /users/register-email`

**Body**:
```json
{
  "documentNumber": "12345678",
  "email": "usuario@example.com"
}
```

**Respuesta exitosa**:
```json
{
  "statusCode": 200,
  "message": "Se ha enviado un correo con instrucciones para activar tu cuenta",
  "success": true,
  "data": {
    "email": "usuario@example.com",
    "activationToken": "abc123xyz789..." // Solo en desarrollo
  }
}
```

**Proceso interno**:
1. Busca el votante por DNI
2. Verifica que no tenga email registrado
3. Verifica que el email no esté en uso
4. Genera un token único de activación
5. Establece expiración del token (24 horas)
6. Asocia el email al usuario del votante
7. Envía correo con link de activación (TODO: implementar envío real)

### 3. Activación de Cuenta
El usuario recibe un email con un link que contiene el token. Al hacer clic, debe crear su contraseña:

**Endpoint**: `POST /users/activate-account`

**Body**:
```json
{
  "token": "abc123xyz789...",
  "password": "MiContraseñaSegura123"
}
```

**Respuesta exitosa**:
```json
{
  "statusCode": 200,
  "message": "Cuenta activada correctamente",
  "success": true,
  "data": {
    "id": 1,
    "name": "Anderson Zapata",
    "email": "usuario@example.com",
    "role": "VOTER",
    "isActive": true,
    "createdAt": "2025-11-15T20:00:00.000Z",
    "updatedAt": "2025-11-15T20:05:00.000Z"
  }
}
```

**Proceso interno**:
1. Busca usuario por token de activación
2. Verifica que el token no haya expirado
3. Verifica que la cuenta no esté ya activa
4. Hashea la contraseña
5. Activa la cuenta (`isActive = true`)
6. Limpia el token de activación

### 4. Reenvío de Token (Opcional)
Si el token expira o el usuario no recibe el email:

**Endpoint**: `POST /users/resend-activation/:email`

**Ejemplo**: `POST /users/resend-activation/usuario@example.com`

**Respuesta exitosa**:
```json
{
  "statusCode": 200,
  "message": "Se ha enviado un nuevo correo con instrucciones para activar tu cuenta",
  "success": true,
  "data": {
    "email": "usuario@example.com",
    "activationToken": "new123token456..." // Solo en desarrollo
  }
}
```

## Modelo de Datos

### Campos Agregados al User
```prisma
model User {
  // ... campos existentes
  
  isActive              Boolean   @default(false)
  activationToken       String?   @unique
  activationTokenExpiry DateTime?
}
```

## Validaciones y Reglas de Negocio

### Registro de Email
- ✅ El DNI debe existir en la tabla `Voter`
- ✅ El votante no debe tener email registrado previamente
- ✅ El email no debe estar en uso por otro usuario
- ✅ Token válido por 24 horas

### Activación de Cuenta
- ✅ El token debe existir y ser válido
- ✅ El token no debe haber expirado
- ✅ La cuenta no debe estar ya activa
- ✅ La contraseña debe tener mínimo 6 caracteres

### Reenvío de Token
- ✅ El usuario debe existir
- ✅ La cuenta no debe estar ya activa
- ✅ Se genera un nuevo token con nueva expiración

## Manejo de Errores

### 404 - Not Found
```json
{
  "statusCode": 404,
  "message": "No se encontró un votante con ese número de documento",
  "success": false,
  "data": null
}
```

### 409 - Conflict
```json
{
  "statusCode": 409,
  "message": "Este correo electrónico ya está registrado",
  "success": false,
  "data": null
}
```

### 400 - Bad Request
```json
{
  "statusCode": 400,
  "message": "Token de activación inválido",
  "success": false,
  "data": null
}
```

## Ejemplos de Uso

### Con cURL

#### 1. Registrar Email
```bash
curl -X POST http://localhost:3000/users/register-email \
  -H "Content-Type: application/json" \
  -d '{
    "documentNumber": "12345678",
    "email": "usuario@example.com"
  }'
```

#### 2. Activar Cuenta
```bash
curl -X POST http://localhost:3000/users/activate-account \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123xyz789...",
    "password": "MiContraseñaSegura123"
  }'
```

#### 3. Reenviar Token
```bash
curl -X POST http://localhost:3000/users/resend-activation/usuario@example.com
```

### Con Postman

1. **Pre-registrar Votante**
   - Method: POST
   - URL: `http://localhost:3000/voters/pre-register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "Juan Pérez",
       "documentNumber": "12345678",
       "votingTableId": 1
     }
     ```

2. **Registrar Email**
   - Method: POST
   - URL: `http://localhost:3000/users/register-email`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "documentNumber": "12345678",
       "email": "usuario@example.com"
     }
     ```

3. **Activar Cuenta**
   - Method: POST
   - URL: `http://localhost:3000/users/activate-account`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "token": "TOKEN_RECIBIDO_EN_PASO_2",
       "password": "MiContraseñaSegura123"
     }
     ```

## Integración con Frontend

### Flujo Recomendado

1. **Pantalla de Pre-registro (Administrador/Sistema)**
   - Se cargan votantes desde padrón electoral
   - App llama a `POST /voters/pre-register` por cada votante
   - Se crea usuario inactivo con DNI

2. **Pantalla de Registro de Usuario (Votante)**
   - Usuario ingresa DNI y email
   - App llama a `POST /users/register-email`
   - Muestra mensaje: "Te hemos enviado un correo a [email]"

3. **Email de Activación**
   - Usuario recibe email con link: `https://app.com/activate?token=abc123`
   - Link abre pantalla de creación de contraseña

4. **Pantalla de Activación**
   - Usuario ingresa contraseña
   - App llama a `POST /users/activate-account`
   - Muestra mensaje de éxito y redirige a login

5. **Opción de Reenvío**
   - Si no recibe email, puede solicitar reenvío
   - App llama a `POST /users/resend-activation/:email`

## TODO - Pendientes

### ⚠️ Implementación de Envío de Emails
Actualmente, el token se devuelve en la respuesta solo para desarrollo. En producción:

1. **Integrar servicio de email** (SendGrid, AWS SES, Mailgun, etc.)
2. **Crear plantilla de email** con diseño profesional
3. **Configurar variables de entorno** para credenciales del servicio
4. **Eliminar token de la respuesta** en endpoints de registro y reenvío

### Ejemplo de Integración con SendGrid
```typescript
// Agregar a user.service.ts
private async sendActivationEmail(email: string, token: string) {
  const activationUrl = `${process.env.FRONTEND_URL}/activate?token=${token}`;
  
  // Configurar y enviar email
  await this.emailService.send({
    to: email,
    subject: 'Activa tu cuenta - InfoVoto',
    template: 'activation',
    data: { activationUrl }
  });
}
```

## Swagger Documentation

Todos los endpoints de activación están documentados en Swagger UI:

```
http://localhost:3000/documentation
```

Busca la sección **Users** para ver los endpoints:
- `POST /users/register-email`
- `POST /users/activate-account`
- `POST /users/resend-activation/:email`

## Seguridad

### Recomendaciones Implementadas
- ✅ Tokens únicos y aleatorios (32 bytes)
- ✅ Tokens con expiración (24 horas)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de unicidad de email
- ✅ Tokens eliminados después de activación

### Recomendaciones Adicionales (Para Producción)
- ⚠️ Rate limiting en endpoints de registro y reenvío
- ⚠️ Captcha en formulario de registro
- ⚠️ Logging de intentos de activación fallidos
- ⚠️ Notificaciones de seguridad por cambios en la cuenta

## Testing

### Pre-requisitos
1. Pre-registrar un votante con DNI
2. Conocer su DNI

### Flujo de Prueba
```bash
# 1. Pre-registrar votante
curl -X POST http://localhost:3000/voters/pre-register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "documentNumber": "12345678",
    "votingTableId": 1
  }'

# 2. Registrar email
curl -X POST http://localhost:3000/users/register-email \
  -H "Content-Type: application/json" \
  -d '{"documentNumber": "12345678", "email": "test@example.com"}'

# 3. Copiar el token de la respuesta

# 4. Activar cuenta
curl -X POST http://localhost:3000/users/activate-account \
  -H "Content-Type: application/json" \
  -d '{"token": "TOKEN_AQUI", "password": "Test123456"}'

# 5. Verificar que isActive = true
curl http://localhost:3000/users/1
```
