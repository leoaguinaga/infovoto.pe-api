import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateGovernmentPlanDto {
  @ApiProperty({
    description: 'ID de la agrupación política a la que pertenece el plan',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  politicalGroupId: number;

  @ApiProperty({
    description: 'Título del plan de gobierno',
    example: 'Plan de Gobierno 2026-2031 – Avanza País',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción general del plan',
    example:
      'Documento que detalla las principales propuestas de la agrupación para el periodo 2026-2031.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Sector al que se orienta el plan (si aplica)',
    example: 'General',
  })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiPropertyOptional({
    description: 'URL del documento PDF del plan de gobierno',
    example: 'https://mi-dominio.com/planes/avanza-pais-2026-2031.pdf',
  })
  @IsOptional()
  @IsUrl()
  documentUrl?: string;

  @ApiPropertyOptional({
    description: 'Año de inicio de vigencia del plan',
    example: 2026,
  })
  @IsOptional()
  @IsInt()
  fromYear?: number;

  @ApiPropertyOptional({
    description: 'Año de fin de vigencia del plan',
    example: 2031,
  })
  @IsOptional()
  @IsInt()
  toYear?: number;
}
