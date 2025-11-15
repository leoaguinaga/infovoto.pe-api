import { PartialType } from '@nestjs/mapped-types';
import { CreateGovernmentPlanDto } from './create-government-plan.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateGovernmentPlanDto extends PartialType(
  CreateGovernmentPlanDto,
) {
  @ApiPropertyOptional({
    description:
      'Nuevo ID de la agrupación política dueña del plan de gobierno',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  politicalGroupId?: number;

  @ApiPropertyOptional({
    description: 'Nuevo título del plan de gobierno',
    example: 'Plan de Gobierno Actualizado 2021-2026',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Nueva descripción general del plan',
    example:
      'Versión actualizada del plan de gobierno con énfasis en reactivación económica.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Nueva URL del documento completo del plan',
    example:
      'https://onpe.gob.pe/planes/partido-ejemplo-plan-actualizado.pdf',
  })
  @IsOptional()
  @IsUrl()
  documentUrl?: string;

  @ApiPropertyOptional({
    description: 'Nuevo año de inicio de vigencia',
    example: 2022,
  })
  @IsOptional()
  @IsInt()
  fromYear?: number;

  @ApiPropertyOptional({
    description: 'Nuevo año de fin de vigencia',
    example: 2027,
  })
  @IsOptional()
  @IsInt()
  toYear?: number;
}
