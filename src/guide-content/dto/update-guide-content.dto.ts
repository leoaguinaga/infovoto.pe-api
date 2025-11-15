import { PartialType } from '@nestjs/mapped-types';
import { CreateGuideContentDto } from './create-guide-content.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { GuideCategory } from 'generated/prisma/client';

export class UpdateGuideContentDto extends PartialType(
  CreateGuideContentDto,
) {
  @ApiPropertyOptional({
    description: 'Nuevo título del contenido informativo',
    example: 'Pasos para ubicar tu local de votación',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Nuevo contenido en texto de la guía',
    example:
      'Actualización: ahora también puedes consultar tu local vía app móvil...',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Nueva categoría de la guía',
    enum: GuideCategory,
    example: GuideCategory.TABLE_MEMBER_DUTIES_VOTING,
  })
  @IsOptional()
  @IsEnum(GuideCategory)
  category?: GuideCategory;

  @ApiPropertyOptional({
    description:
      'ID de la elección a la que se asocia la guía (puede cambiar o quedar sin elección)',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  electionId?: number;
}
