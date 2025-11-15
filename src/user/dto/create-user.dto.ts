import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Anderson Zapata',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario (único). Opcional para pre-registro de votantes.',
    example: 'anderson@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Contraseña en texto plano (se almacenará hasheada). Opcional para pre-registro de votantes.',
    example: 'MiContraseñaSegura123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario dentro del sistema. Por defecto: VOTER',
    enum: UserRole,
    example: UserRole.VOTER,
    default: UserRole.VOTER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
