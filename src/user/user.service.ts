// src/user/user.service.ts
import {
  Injectable,
  HttpStatus,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { ServiceResponse } from '../interfaces/serviceResponse';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  // para no devolver passwordHash
  private readonly baseSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  };

  async create(createUserDto: CreateUserDto): Promise<ServiceResponse<any>> {
    const { name, email, password, role } = createUserDto;

    // aseguramos que el email sea único
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

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role ?? UserRole.VOTER,
      },
      select: this.baseSelect,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Usuario creado correctamente',
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
}
