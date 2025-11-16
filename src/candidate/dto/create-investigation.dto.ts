import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString, IsUrl } from 'class-validator';
import { InvestigationStatus } from '@prisma/client';

export class CreateInvestigationDto {
  @ApiProperty({
    description: 'ID del candidato',
    example: 1,
  })
  @IsNotEmpty()
  candidateId: number;

  @ApiProperty({
    description: 'Tipo de investigación',
    example: 'Presunta colusión',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Descripción del caso',
    example: 'Investigación por presuntos actos de corrupción en la gestión pública',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Institución que lleva el caso',
    example: 'Jurado Nacional de Elecciones (JNE)',
  })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiProperty({
    description: 'Estado de la investigación',
    enum: InvestigationStatus,
    example: 'IN_PROGRESS',
  })
  @IsEnum(InvestigationStatus)
  @IsNotEmpty()
  status: InvestigationStatus;

  @ApiPropertyOptional({
    description: 'Fecha de presentación del caso',
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  filingDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de resolución',
    example: '2024-06-20T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  resolutionDate?: string;

  @ApiPropertyOptional({
    description: 'Resultado del proceso',
    example: 'Archivado por falta de pruebas',
  })
  @IsOptional()
  @IsString()
  outcome?: string;

  @ApiPropertyOptional({
    description: 'URL de la fuente oficial',
    example: 'https://jne.gob.pe/caso-123',
  })
  @IsOptional()
  @IsUrl()
  sourceUrl?: string;
}
