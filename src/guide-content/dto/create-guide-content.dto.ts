import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GuideCategory } from '@prisma/client';

export class CreateGuideContentDto {
  @ApiProperty({
    description: 'Título del contenido informativo',
    example: '¿Cómo ubicar tu local de votación?',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Contenido en texto de la guía',
    example:
      'Para ubicar tu local de votación, ingresa a la plataforma y digita tu DNI...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Categoría de la guía',
    enum: GuideCategory,
    example: GuideCategory.ELECTOR_LOCATION,
  })
  @IsEnum(GuideCategory)
  category: GuideCategory;

  @ApiPropertyOptional({
    description: 'ID de la elección a la que está asociada la guía (opcional)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  electionId?: number;
}
