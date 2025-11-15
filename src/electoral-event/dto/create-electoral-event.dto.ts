import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ElectoralEventCategory } from 'generated/prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateElectoralEventDto {
  @ApiProperty({
    description: 'ID de la elección a la que pertenece el evento',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  electionId: number;

  @ApiProperty({
    description: 'Nombre del evento electoral',
    example: 'Fecha límite para cambio de local de votación',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del evento',
    example:
      'Último día para solicitar el cambio de local de votación a través de la plataforma.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Fecha y hora del evento (formato ISO 8601)',
    example: '2025-12-15T23:59:59.000Z',
  })
  @IsDateString()
  date: string; // lo convertimos a Date en el service

  @ApiProperty({
    description: 'Categoría del evento electoral',
    enum: ElectoralEventCategory,
    example: ElectoralEventCategory.ELECTION_DAY,
  })
  @IsEnum(ElectoralEventCategory)
  category: ElectoralEventCategory;

  @ApiPropertyOptional({
    description: 'Indica si el evento está publicado o no',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
