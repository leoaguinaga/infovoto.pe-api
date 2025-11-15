import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActivateAccountDto {
  @ApiProperty({
    description: 'Token de activación enviado por correo',
    example: 'abc123xyz789',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Nueva contraseña para la cuenta',
    example: 'MiContraseñaSegura123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
