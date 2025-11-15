import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor() {
    this.createTransporter();
  }

  private createTransporter() {
    // Configuración para desarrollo con Ethereal Email (emails de prueba)
    // En producción, usar Gmail, SendGrid, AWS SES, etc.
    if (process.env.MAIL_HOST && process.env.MAIL_PORT) {
      // Configuración desde variables de entorno
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: process.env.MAIL_SECURE === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      this.logger.log('Transporter de email configurado desde variables de entorno');
    } else {
      // Configuración de desarrollo con Mailtrap/Ethereal
      this.logger.warn('⚠️  No se encontró configuración de email. Usando modo de desarrollo.');
      this.logger.warn('📧 Configura las variables de entorno MAIL_* para enviar emails reales.');
      
      // Crear cuenta de prueba en Ethereal
      nodemailer.createTestAccount((err, account) => {
        if (err) {
          this.logger.error('Error al crear cuenta de prueba:', err);
          return;
        }

        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.logger.log('📧 Usando Ethereal Email para pruebas');
        this.logger.log(`Usuario: ${account.user}`);
        this.logger.log(`Contraseña: ${account.pass}`);
      });
    }
  }

  /**
   * Enviar email de activación de cuenta
   */
  async sendActivationEmail(
    to: string,
    name: string,
    activationToken: string,
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const activationUrl = `${frontendUrl}/activate?token=${activationToken}`;

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME || 'InfoVoto Perú'}" <${process.env.MAIL_FROM_EMAIL || 'noreply@infovoto.pe'}>`,
        to,
        subject: 'Activa tu cuenta - InfoVoto Perú',
        html: this.getActivationEmailTemplate(name, activationUrl),
      });

      this.logger.log(`Email de activación enviado a: ${to}`);
      
      // Si estamos usando Ethereal, mostrar preview URL
      if (info.messageId) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          this.logger.log(`📧 Preview del email: ${previewUrl}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error al enviar email a ${to}:`, error);
      throw error;
    }
  }

  /**
   * Plantilla HTML para email de activación
   */
  private getActivationEmailTemplate(name: string, activationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activa tu cuenta</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #1a56db;
            margin-bottom: 10px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 20px;
          }
          .content {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background-color: #1a56db;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #1543b8;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #888;
            text-align: center;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
            color: #856404;
          }
          .link {
            word-break: break-all;
            color: #1a56db;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DECIDE.PE</div>
            <div class="title">¡Hola, ${name}!</div>
          </div>
          
          <div class="content">
            <p>Gracias por registrarte en <strong>InfoVoto Perú</strong>, tu plataforma para estar informado sobre las elecciones.</p>
            
            <p>Para completar tu registro y activar tu cuenta, haz clic en el siguiente botón:</p>
            
            <div style="text-align: center;">
              <a href="${activationUrl}" class="button">Activar cuenta</a>
            </div>
            
            <div class="warning">
              <strong>⏰ Importante:</strong> Este enlace es válido por 24 horas. Después de ese tiempo, tendrás que solicitar un nuevo enlace de activación.
            </div>
            
            <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
            <p><a href="${activationUrl}" class="link">${activationUrl}</a></p>
            
            <p>Si no solicitaste esta activación, puedes ignorar este correo de forma segura.</p>
          </div>
          
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; 2025 InfoVoto Perú. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Enviar email genérico (para uso futuro)
   */
  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME || 'InfoVoto Perú'}" <${process.env.MAIL_FROM_EMAIL || 'noreply@infovoto.pe'}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email enviado a: ${to}`);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`📧 Preview del email: ${previewUrl}`);
      }
    } catch (error) {
      this.logger.error(`Error al enviar email a ${to}:`, error);
      throw error;
    }
  }
}
