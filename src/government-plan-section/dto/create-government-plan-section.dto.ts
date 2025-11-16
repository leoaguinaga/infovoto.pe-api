import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GovernmentPlanSector } from '@prisma/client';

export class CreateGovernmentPlanSectionDto {
  @ApiProperty({
    description: 'ID del plan de gobierno al que pertenece la sección',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  governmentPlanId: number;

  @ApiProperty({
    description: 'Sector temático al que pertenece la sección del plan de gobierno',
    enum: GovernmentPlanSector,
    example: GovernmentPlanSector.HEALTH,
  })
  @IsEnum(GovernmentPlanSector)
  sector: GovernmentPlanSector;

  @ApiProperty({
    description: 'Problema identificado que se busca abordar en esta sección',
    example: 'Insuficiente cobertura de servicios de salud en zonas rurales',
  })
  @IsString()
  @IsNotEmpty()
  problemIdentified: string;

  @ApiProperty({
    description: 'Objetivo estratégico que se busca alcanzar con esta sección',
    example: 'Mejorar la accesibilidad y calidad de los servicios de salud en zonas rurales',
  })
  @IsString()
  @IsNotEmpty()
  strategicObjective: string;

  @ApiProperty({
    description: 'Indicadores para medir el progreso hacia el objetivo estratégico',
    example: 'Número de centros de salud mejorados, tasa de satisfacción de usuarios',
  })
  @IsString()
  @IsNotEmpty()
  indicators: string;

  @ApiProperty({
    description: 'Metas específicas que se buscan alcanzar en esta sección',
    example: 'Incrementar la cobertura de salud en zonas rurales al 90% para 2026',
  })
  @IsString()
  @IsNotEmpty()
  goals: string;

  @ApiProperty({
    description: 'Título descriptivo de la sección',
    example: 'Fortalecimiento del sistema de salud pública',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Contenido o desarrollo de la propuesta para esta sección',
    example:
      'Se propone incrementar el presupuesto en salud al 6% del PBI, priorizando la atención primaria...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description:
      'Orden de aparición de la sección dentro del plan de gobierno (para mantener una estructura)',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  order: number;
}
