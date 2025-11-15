# Configuración de Envío de Emails

## Descripción General

El sistema utiliza **Nodemailer** para enviar emails de activación de cuenta. Soporta múltiples proveedores de email y tiene un modo de desarrollo automático.

## Modo de Desarrollo (Por Defecto)

Si no configuras variables de entorno para email, el sistema usará automáticamente **Ethereal Email**, un servicio de emails de prueba.

### Características del Modo de Desarrollo:
- ✅ No requiere configuración
- ✅ Genera cuentas de prueba automáticamente
- ✅ Los emails no se envían realmente
- ✅ Preview URL en los logs para ver los emails
- ✅ Perfecto para desarrollo y testing

### Cómo Ver los Emails de Prueba:

1. Ejecuta la aplicación normalmente
2. Registra un email de usuario
3. Revisa los logs en la consola:
   ```
   [MailService] 📧 Usando Ethereal Email para pruebas
   [MailService] Usuario: username@ethereal.email
   [MailService] Contraseña: password123
   [MailService] Email de activación enviado a: usuario@example.com
   [MailService] 📧 Preview del email: https://ethereal.email/message/xxxxx
   ```
4. Haz clic en el link de preview para ver el email

## Configuración para Producción

### Variables de Entorno Requeridas:

```env
# Configuración de Email
MAIL_HOST=smtp.ejemplo.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu-usuario
MAIL_PASSWORD=tu-contraseña
MAIL_FROM_NAME=InfoVoto Perú
MAIL_FROM_EMAIL=noreply@infovoto.pe

# URL del frontend (para links de activación)
FRONTEND_URL=https://tu-dominio.com
```

## Proveedores Soportados

### 1. Gmail (Recomendado para proyectos pequeños)

**Configuración**:
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
MAIL_FROM_NAME=InfoVoto Perú
MAIL_FROM_EMAIL=tu-email@gmail.com
```

**Pasos para configurar Gmail**:

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en dos pasos (actívala si no lo está)
3. Seguridad → Contraseñas de aplicaciones
4. Selecciona "Correo" y "Otro (nombre personalizado)"
5. Escribe "InfoVoto API"
6. Copia la contraseña de 16 caracteres
7. Úsala en `MAIL_PASSWORD`

**Limitaciones**:
- Límite de 500 emails por día
- Puede marcar como spam si envías muchos emails
- Requiere App Password (2FA debe estar activado)

---

### 2. SendGrid (Recomendado para producción)

**Configuración**:
```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=apikey
MAIL_PASSWORD=tu-sendgrid-api-key
MAIL_FROM_NAME=InfoVoto Perú
MAIL_FROM_EMAIL=noreply@infovoto.pe
```

**Pasos para configurar SendGrid**:

1. Crea una cuenta en https://sendgrid.com/
2. Ve a Settings → API Keys
3. Crea un nuevo API Key con permisos de "Mail Send"
4. Copia el API Key
5. Úsalo en `MAIL_PASSWORD` (el usuario siempre es "apikey")
6. Verifica tu dominio de email en SendGrid

**Ventajas**:
- ✅ 100 emails gratis por día
- ✅ Escalable a millones de emails
- ✅ Analytics y tracking
- ✅ Alta deliverability
- ✅ Gestión de bounces y spam

---

### 3. AWS SES (Recomendado para alto volumen)

**Configuración**:
```env
MAIL_HOST=email-smtp.us-east-1.amazonaws.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu-smtp-user
MAIL_PASSWORD=tu-smtp-password
MAIL_FROM_NAME=InfoVoto Perú
MAIL_FROM_EMAIL=noreply@infovoto.pe
```

**Pasos para configurar AWS SES**:

1. Accede a AWS Console → SES
2. Verifica tu dominio o email
3. Ve a "SMTP Settings"
4. Crea credenciales SMTP
5. Copia el usuario y contraseña SMTP
6. Úsalos en las variables de entorno

**Ventajas**:
- ✅ Muy económico ($0.10 por 1,000 emails)
- ✅ Escalable a millones de emails
- ✅ Integración con otros servicios AWS
- ✅ Alta deliverability

**Desventaja**:
- ⚠️ Inicialmente en "sandbox mode" (solo emails verificados)
- ⚠️ Requiere solicitar salir del sandbox para producción

---

### 4. Mailtrap (Solo para desarrollo/testing)

**Configuración**:
```env
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_SECURE=false
MAIL_USER=tu-mailtrap-user
MAIL_PASSWORD=tu-mailtrap-password
MAIL_FROM_NAME=InfoVoto Perú
MAIL_FROM_EMAIL=noreply@infovoto.pe
```

**Pasos para configurar Mailtrap**:

1. Crea una cuenta en https://mailtrap.io/
2. Crea un Inbox
3. Ve a "SMTP Settings"
4. Copia las credenciales
5. Úsalas en las variables de entorno

**Ventajas**:
- ✅ Perfecto para testing
- ✅ UI web para ver emails
- ✅ Testing de spam score
- ✅ Gratis hasta 500 emails/mes

**Nota**: Solo para desarrollo, no envía emails reales.

---

### 5. Otros Proveedores

El sistema también soporta:
- **Mailgun**
- **SparkPost**
- **Postmark**
- **Resend**
- Cualquier servidor SMTP estándar

## Plantilla de Email

### Características de la Plantilla Actual:

- ✅ Diseño responsive (se ve bien en móvil y desktop)
- ✅ HTML profesional con estilos inline
- ✅ Botón de activación destacado
- ✅ Link alternativo si el botón no funciona
- ✅ Advertencia sobre expiración del token (24 horas)
- ✅ Footer con información legal
- ✅ Branding con logo "DECIDE.PE"

### Personalizar la Plantilla:

Edita el método `getActivationEmailTemplate()` en `src/mail/mail.service.ts`:

```typescript
private getActivationEmailTemplate(name: string, activationUrl: string): string {
  // Tu HTML personalizado aquí
}
```

## Testing del Sistema de Email

### Prueba 1: Verificar Configuración

```bash
# Iniciar el servidor
npm run start:dev

# Revisar logs - debe mostrar:
# [MailService] 📧 Usando Ethereal Email para pruebas
# O
# [MailService] Transporter de email configurado desde variables de entorno
```

### Prueba 2: Enviar Email de Activación

```bash
# 1. Pre-registrar votante
curl -X POST http://localhost:3000/voters/pre-register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "documentNumber": "12345678"
  }'

# 2. Registrar email
curl -X POST http://localhost:3000/users/register-email \
  -H "Content-Type: application/json" \
  -d '{
    "documentNumber": "12345678",
    "email": "test@example.com"
  }'

# 3. Revisar logs para el preview URL (si usas Ethereal)
```

### Prueba 3: Verificar el Email

Si usas Ethereal:
1. Copia el preview URL de los logs
2. Ábrelo en el navegador
3. Verifica que el email se vea correctamente
4. Haz clic en "Activar cuenta"
5. Copia el token del URL

Si usas Gmail/SendGrid/etc:
1. Revisa tu bandeja de entrada
2. Abre el email
3. Haz clic en "Activar cuenta"

## Troubleshooting

### Error: "ECONNREFUSED" o "Connection refused"

**Causa**: No puede conectar al servidor SMTP

**Solución**:
- Verifica que `MAIL_HOST` y `MAIL_PORT` sean correctos
- Verifica tu conexión a internet
- Verifica que tu firewall no bloquee el puerto

### Error: "Invalid login"

**Causa**: Credenciales incorrectas

**Solución**:
- Verifica `MAIL_USER` y `MAIL_PASSWORD`
- Si usas Gmail, asegúrate de usar App Password, no tu contraseña normal
- Verifica que el usuario sea correcto (para SendGrid es "apikey")

### Los emails van a spam

**Solución**:
- Verifica tu dominio en el proveedor
- Configura SPF, DKIM y DMARC records
- Usa un dominio profesional (no @gmail.com en producción)
- Evita palabras spam en el subject

### No recibo emails en desarrollo

**Solución**:
- Usa Ethereal Email (configuración por defecto)
- Revisa los logs para el preview URL
- O usa Mailtrap para un inbox de prueba

## Mejores Prácticas

1. **Desarrollo**: Usa Ethereal (automático) o Mailtrap
2. **Testing/Staging**: Usa Mailtrap o Gmail
3. **Producción**: Usa SendGrid, AWS SES o servicio profesional
4. **Monitoreo**: Revisa logs de emails enviados/fallidos
5. **Rate Limiting**: Implementa límites para evitar spam
6. **Verificación de Dominio**: Verifica tu dominio en el proveedor
7. **Templates**: Mantén templates en archivos separados para facilitar cambios
8. **Fallback**: Ten un plan B si el servicio principal falla

## Monitoreo y Logs

El sistema automáticamente logea:
- ✅ Emails enviados exitosamente
- ✅ Preview URLs (en desarrollo)
- ✅ Errores al enviar emails
- ✅ Configuración del transporter

Ejemplo de logs:
```
[MailService] 📧 Usando Ethereal Email para pruebas
[MailService] Email de activación enviado a: user@example.com
[MailService] 📧 Preview del email: https://ethereal.email/message/xxxxx
```

## Seguridad

- ✅ Nunca commitees credenciales en Git
- ✅ Usa variables de entorno
- ✅ Usa App Passwords en lugar de contraseñas reales
- ✅ Limita los intentos de envío por IP
- ✅ Valida emails antes de enviar
- ✅ Implementa rate limiting

## Escalabilidad

Para alto volumen de emails:
1. Usa un servicio profesional (SendGrid, AWS SES)
2. Implementa cola de emails (Bull, RabbitMQ)
3. Procesa emails en background
4. Monitorea métricas de deliverability
5. Gestiona bounces y unsubscribes

## Soporte

Si tienes problemas:
1. Revisa los logs en la consola
2. Verifica las variables de entorno
3. Prueba con Ethereal primero
4. Consulta la documentación de tu proveedor
5. Revisa el código en `src/mail/mail.service.ts`
