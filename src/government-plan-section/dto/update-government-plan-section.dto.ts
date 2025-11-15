import { PartialType } from '@nestjs/mapped-types';
import { CreateGovernmentPlanSectionDto } from './create-government-plan-section.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { GovernmentPlanSector } from '@prisma/client';

export class UpdateGovernmentPlanSectionDto extends PartialType(
  CreateGovernmentPlanSectionDto,
) {
  @ApiPropertyOptional({
    description: 'Nuevo ID del plan de gobierno al que pertenece la sección',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  governmentPlanId?: number;

  @ApiPropertyOptional({
    description: 'Nuevo sector temático de la sección',
    enum: GovernmentPlanSector,
    example: GovernmentPlanSector.EDUCATION,
  })
  @IsOptional()
  @IsEnum(GovernmentPlanSector)
  sector?: GovernmentPlanSector;

  @ApiPropertyOptional({
    description: 'Nuevo título de la sección',
    example: 'Mejora de la calidad educativa en zonas rurales',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Nuevo contenido de la sección',
    example:
      'Se implementarán programas de capacitación docente y dotación de infraestructura digital en escuelas rurales...',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Nuevo orden de aparición de la sección dentro del plan de gobierno',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  order?: number;
}
