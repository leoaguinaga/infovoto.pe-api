import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGovernmentPlanDto {
  @ApiProperty({
    description: 'ID de la agrupación política dueña del plan de gobierno',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  politicalGroupId: number;

  @ApiProperty({
    description: 'Título del plan de gobierno',
    example: 'Plan de Gobierno 2021-2026',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción general o resumen del plan de gobierno',
    example:
      'Documento que recoge las principales propuestas programáticas del partido para el periodo 2021-2026.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL del documento completo del plan de gobierno (PDF, etc.)',
    example:
      'https://onpe.gob.pe/planes/partido-ejemplo-plan-2021-2026.pdf',
  })
  @IsOptional()
  @IsUrl()
  documentUrl?: string;

  @ApiPropertyOptional({
    description: 'Año de inicio de vigencia del plan de gobierno',
    example: 2021,
  })
  @IsOptional()
  @IsInt()
  fromYear?: number;

  @ApiPropertyOptional({
    description: 'Año de fin de vigencia del plan de gobierno',
    example: 2026,
  })
  @IsOptional()
  @IsInt()
  toYear?: number;
}
