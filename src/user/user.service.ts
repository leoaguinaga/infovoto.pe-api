// src/user/user.service.ts
import {
  Injectable,
  HttpStatus,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterEmailDto } from './dto/register-email.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ServiceResponse } from '../interfaces/serviceResponse';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // para no devolver passwordHash
  private readonly baseSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  async create(createUserDto: CreateUserDto): Promise<ServiceResponse<any>> {
    const { name, email, password, role } = createUserDto;

    // Si se proporciona email, verificar que sea único
    if (email) {
      const existing = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'El correo ya está registrado',
          success: false,
          data: null,
        });
      }
    }

    // Preparar datos para crear usuario
    const userData: any = {
      name,
      role: role ?? UserRole.VOTER,
    };

    // Solo agregar email si se proporciona
    if (email) {
      userData.email = email;
    }

    // Solo hashear y agregar contraseña si se proporciona
    if (password) {
      userData.passwordHash = await bcrypt.hash(password, 10);
      // Si tiene contraseña, activar la cuenta automáticamente
      userData.isActive = true;
    } else {
      // Sin contraseña, la cuenta permanece inactiva
      userData.isActive = false;
    }

    const user = await this.prisma.user.create({
      data: userData,
      select: this.baseSelect,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: password 
        ? 'Usuario creado y activado correctamente' 
        : 'Usuario pre-registrado correctamente. Debe completar el registro con email y contraseña.',
      success: true,
      data: user,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const users = await this.prisma.user.findMany({
      select: this.baseSelect,
      orderBy: { id: 'asc' },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de usuarios obtenido correctamente',
      success: true,
      data: users,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.baseSelect,
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario obtenido correctamente',
      success: true,
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado',
        success: false,
        data: null,
      });
    }

    const data: any = {
      name: updateUserDto.name,
      email: updateUserDto.email,
      role: updateUserDto.role,
    };

    // si viene password, lo hasheamos
    if (updateUserDto.password) {
      data.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    // limpiamos undefined para no sobrescribir campos
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: this.baseSelect,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario actualizado correctamente',
      success: true,
      data: user,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: this.baseSelect,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado',
        success: false,
        data: null,
      });
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario eliminado correctamente',
      success: true,
      data: existing, // devolvemos el usuario eliminado sin passwordHash
    };
  }

  /**
   * Registrar email para un votante existente (pre-registrado)
   * Genera un token de activación y lo envía por email
   */
  async registerEmail(registerEmailDto: RegisterEmailDto): Promise<ServiceResponse<any>> {
    const { documentNumber, email } = registerEmailDto;

    // Buscar votante por DNI
    const voter = await this.prisma.voter.findUnique({
      where: { documentNumber },
      include: { user: true },
    });

    if (!voter) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No se encontró un votante con ese número de documento',
        success: false,
        data: null,
      });
    }

    // Verificar si el usuario ya tiene email registrado
    if (voter.user.email) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Este votante ya tiene un correo electrónico registrado',
        success: false,
        data: null,
      });
    }

    // Verificar si el email ya está en uso
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Este correo electrónico ya está registrado',
        success: false,
        data: null,
      });
    }

    // Generar token de activación
    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationTokenExpiry = new Date();
    activationTokenExpiry.setHours(activationTokenExpiry.getHours() + 24); // válido por 24 horas

    // Actualizar usuario con email y token
    const user = await this.prisma.user.update({
      where: { id: voter.userId },
      data: {
        email,
        activationToken,
        activationTokenExpiry,
      },
      select: this.baseSelect,
    });

    // Enviar email con el token de activación
    try {
      await this.mailService.sendActivationEmail(
        email,
        voter.user.name,
        activationToken,
      );
      this.logger.log(`Email de activación enviado a: ${email}`);
    } catch (error) {
      this.logger.error(`Error al enviar email de activación a ${email}:`, error);
      // No lanzamos error para no interrumpir el flujo
      // El token sigue siendo válido aunque el email falle
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Se ha enviado un correo con instrucciones para activar tu cuenta',
      success: true,
      data: {
        email: user.email,
        message: 'Revisa tu bandeja de entrada y spam',
      },
    };
  }

  /**
   * Activar cuenta con token y establecer contraseña
   */
  async activateAccount(activateAccountDto: ActivateAccountDto): Promise<ServiceResponse<any>> {
    const { token, password } = activateAccountDto;

    // Buscar usuario por token
    const user = await this.prisma.user.findUnique({
      where: { activationToken: token },
    });

    if (!user) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Token de activación inválido',
        success: false,
        data: null,
      });
    }

    // Verificar si el token ha expirado
    if (user.activationTokenExpiry && user.activationTokenExpiry < new Date()) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'El token de activación ha expirado',
        success: false,
        data: null,
      });
    }

    // Verificar si la cuenta ya está activa
    if (user.isActive) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Esta cuenta ya ha sido activada',
        success: false,
        data: null,
      });
    }

    // Hashear contraseña y activar cuenta
    const passwordHash = await bcrypt.hash(password, 10);

    const activatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        isActive: true,
        activationToken: null,
        activationTokenExpiry: null,
      },
      select: this.baseSelect,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Cuenta activada correctamente',
      success: true,
      data: activatedUser,
    };
  }

  /**
   * Reenviar token de activación
   */
  async resendActivationToken(email: string): Promise<ServiceResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No se encontró un usuario con ese correo electrónico',
        success: false,
        data: null,
      });
    }

    if (user.isActive) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Esta cuenta ya está activada',
        success: false,
        data: null,
      });
    }

    // Generar nuevo token
    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationTokenExpiry = new Date();
    activationTokenExpiry.setHours(activationTokenExpiry.getHours() + 24);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        activationToken,
        activationTokenExpiry,
      },
    });

    // Enviar email con el nuevo token
    try {
      await this.mailService.sendActivationEmail(
        email,
        user.name,
        activationToken,
      );
      this.logger.log(`Nuevo email de activación enviado a: ${email}`);
    } catch (error) {
      this.logger.error(`Error al enviar email de activación a ${email}:`, error);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Se ha enviado un nuevo correo con instrucciones para activar tu cuenta',
      success: true,
      data: {
        email: user.email,
        message: 'Revisa tu bandeja de entrada y spam',
      },
    };
  }
}
