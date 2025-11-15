import {
  Injectable,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ServiceResponse } from '../interfaces/serviceResponse';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ServiceResponse<any>> {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Credenciales inválidas',
        success: false,
        data: null,
      });
    }

    // Verificar si la cuenta está activa
    if (!user.isActive) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Tu cuenta no ha sido activada. Revisa tu correo electrónico.',
        success: false,
        data: null,
      });
    }

    // Verificar contraseña
    if (!user.passwordHash) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Debes activar tu cuenta antes de iniciar sesión',
        success: false,
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Credenciales inválidas',
        success: false,
        data: null,
      });
    }

    // Generar token JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email!,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      statusCode: HttpStatus.OK,
      message: 'Inicio de sesión exitoso',
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }
}
