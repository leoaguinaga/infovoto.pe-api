import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CandidateOffice } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCandidateDto {
  @ApiProperty({
    description: 'Nombre completo del candidato',
    example: 'María Pérez López',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Cargo al que postula el candidato',
    enum: CandidateOffice,
    example: CandidateOffice.PRESIDENT,
  })
  @IsEnum(CandidateOffice)
  office: CandidateOffice;

  @ApiPropertyOptional({
    description: 'Breve biografía o perfil del candidato',
    example:
      'Abogada con 15 años de experiencia en gestión pública y derechos humanos.',
  })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto del candidato',
    example: 'https://misitio.com/fotos/maria-perez.jpg',
  })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @ApiProperty({
    description: 'ID de la agrupación política a la que pertenece',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  politicalGroupId: number;

  @ApiPropertyOptional({
    description:
      'ID del usuario dueño de la cuenta del candidato dentro de la app (para crear posts, etc.)',
    example: 15,
  })
  @IsOptional()
  @IsInt()
  userId?: number; // usuario dueño de la cuenta del candidato (para posts, etc.)
}
