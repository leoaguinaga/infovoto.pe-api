import { PartialType } from '@nestjs/mapped-types';
import { CreateElectionDto } from './create-election.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ElectionType } from '@prisma/client';

export class UpdateElectionDto extends PartialType(CreateElectionDto) {
  @ApiPropertyOptional({
    description: 'Nuevo nombre de la elección',
    example: 'Elecciones Generales 2026 (segunda vuelta)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Nueva descripción de la elección',
    example: 'Proceso de segunda vuelta para la elección presidencial.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Nuevo tipo de elección',
    enum: ElectionType,
    example: ElectionType.GENERAL,
  })
  @IsOptional()
  @IsEnum(ElectionType)
  type?: ElectionType;

  @ApiPropertyOptional({
    description: 'Nueva fecha de la elección (formato ISO 8601)',
    example: '2026-06-06T08:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
