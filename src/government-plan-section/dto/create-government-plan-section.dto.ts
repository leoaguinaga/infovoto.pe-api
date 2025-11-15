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
