# InfoVoto Peru API

API REST para el sistema de información electoral de Perú, construida con NestJS, Prisma y PostgreSQL.

## Características

- 🗳️ **Sistema Electoral Completo**: Gestión de elecciones, candidatos, partidos políticos y planes de gobierno
- 👥 **Gestión de Usuarios**: Pre-registro con DNI, activación por email y autenticación JWT
- 📧 **Sistema de Correos**: Envío de emails de activación con soporte para múltiples proveedores
- 📁 **Upload de Archivos**: Sistema de subida de imágenes para partidos, candidatos, posts y comentarios
- 🔐 **Autenticación JWT**: Protección de endpoints con soporte para rutas públicas
- 📊 **Documentación Swagger**: API docs interactiva con autenticación incluida
- 🎯 **TypeScript**: Tipado fuerte en toda la aplicación

## Tecnologías

- [NestJS](https://nestjs.com/) - Framework backend
- [Prisma](https://www.prisma.io/) - ORM para PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) - Base de datos
- [JWT](https://jwt.io/) - Autenticación
- [Nodemailer](https://nodemailer.com/) - Envío de emails
- [Multer](https://github.com/expressjs/multer) - Upload de archivos
- [Swagger/OpenAPI](https://swagger.io/) - Documentación de API

## Requisitos Previos

- Node.js 18+ y pnpm
- PostgreSQL 14+

## Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Configurar .env con tus credenciales de base de datos y JWT_SECRET
# DATABASE_URL="postgresql://user:password@localhost:5432/infovoto"
# JWT_SECRET="tu_clave_secreta_super_segura"
# JWT_EXPIRES_IN="24h"

# Ejecutar migraciones de Prisma
npx prisma migrate dev

# Generar cliente de Prisma
npx prisma generate
```

## Configuración

### Variables de Entorno

Edita el archivo `.env` con tu configuración:

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/infovoto"

# Servidor
PORT=3000

# JWT Authentication
JWT_SECRET="tu_clave_secreta_super_segura"
JWT_EXPIRES_IN="24h"

# Frontend URL
FRONTEND_URL="http://localhost:3001"

# Email (opcional, usa Ethereal automáticamente si no se configura)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="tu-email@gmail.com"
MAIL_PASSWORD="tu-app-password"
```

Para más detalles sobre configuración de email, ver [EMAIL_CONFIG_GUIDE.md](./EMAIL_CONFIG_GUIDE.md).

## Ejecutar la Aplicación

```bash
# Modo desarrollo
pnpm run start:dev

# Modo producción
pnpm run build
pnpm run start:prod
```

La API estará disponible en `http://localhost:3000`

## Documentación

### Swagger UI

Accede a la documentación interactiva en: `http://localhost:3000/documentation`

### Guías

- **[JWT_AUTH_GUIDE.md](./JWT_AUTH_GUIDE.md)** - Sistema de autenticación JWT y rutas públicas
- **[ACCOUNT_ACTIVATION_GUIDE.md](./ACCOUNT_ACTIVATION_GUIDE.md)** - Flujo de registro y activación de cuentas
- **[EMAIL_CONFIG_GUIDE.md](./EMAIL_CONFIG_GUIDE.md)** - Configuración del sistema de correos
- **[UPLOAD_GUIDE.md](./UPLOAD_GUIDE.md)** - Sistema de subida de archivos

## Endpoints Principales

### Autenticación (Público)
- `POST /auth/login` - Iniciar sesión
- `POST /voters/pre-register` - Pre-registrar votante con DNI
- `POST /users/register-email` - Registrar email
- `POST /users/activate-account` - Activar cuenta

### Consulta de Información (Público)
- `GET /elections` - Listar elecciones
- `GET /political-groups` - Listar partidos políticos
- `GET /candidates` - Listar candidatos
- `GET /government-plans` - Listar planes de gobierno

### Gestión (Requiere Autenticación)
- `GET /auth/profile` - Perfil del usuario
- `POST /political-groups` - Crear partido político
- `POST /candidates` - Crear candidato
- `POST /posts` - Crear publicación
- `POST /comments` - Crear comentario

Ver la [documentación Swagger](http://localhost:3000/documentation) para la lista completa de endpoints.

## Flujo de Registro

1. **Pre-registro** con DNI: `POST /voters/pre-register`
2. **Registro de email**: `POST /users/register-email` (envía email de activación)
3. **Activación**: `POST /users/activate-account` con el token recibido
4. **Login**: `POST /auth/login` con email y contraseña

Ver [ACCOUNT_ACTIVATION_GUIDE.md](./ACCOUNT_ACTIVATION_GUIDE.md) para más detalles.

## Autenticación JWT

### Login

```bash
POST /auth/login
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1..."
  }
}
```

### Usar Token

Incluye el token en el header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

Ver [JWT_AUTH_GUIDE.md](./JWT_AUTH_GUIDE.md) para más detalles.

## Base de Datos

### Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Ver estado de migraciones
npx prisma migrate status
```

### Prisma Studio

```bash
# Abrir interfaz visual de la base de datos
npx prisma studio
```

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Estructura del Proyecto

```
src/
├── auth/              # Autenticación JWT
├── user/              # Gestión de usuarios
├── voter/             # Gestión de votantes
├── election/          # Elecciones
├── political-group/   # Partidos políticos
├── candidate/         # Candidatos
├── government-plan/   # Planes de gobierno
├── post/              # Publicaciones
├── comment/           # Comentarios
├── mail/              # Sistema de correos
├── upload/            # Subida de archivos
├── prisma/            # Cliente Prisma
└── interfaces/        # Interfaces compartidas

uploads/               # Archivos subidos
├── political-groups/
├── candidates/
├── posts/
├── comments/
└── guide-contents/

prisma/
├── schema.prisma      # Esquema de base de datos
└── migrations/        # Migraciones
```

## Seguridad

- ✅ Autenticación JWT con tokens firmados
- ✅ Bcrypt para hash de contraseñas
- ✅ Validación de DTOs con class-validator
- ✅ Guards globales con bypass para rutas públicas
- ✅ CORS configurado
- ⚠️ **IMPORTANTE**: Cambia `JWT_SECRET` en producción por una clave segura

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

---

Desarrollado con ❤️ para las elecciones de Perú
