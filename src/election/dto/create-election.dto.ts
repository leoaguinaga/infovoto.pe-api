import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ElectionType } from '@prisma/client';

export class CreateElectionDto {
  @ApiProperty({
    description: 'Nombre de la elección',
    example: 'Elecciones Generales 2026',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción general de la elección',
    example: 'Proceso electoral para elegir Presidente, Congreso y Parlamento Andino.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Tipo de elección',
    enum: ElectionType,
    example: ElectionType.GENERAL,
  })
  @IsEnum(ElectionType)
  type: ElectionType;

  @ApiProperty({
    description: 'Fecha de la elección (formato ISO 8601)',
    example: '2026-04-12T08:00:00.000Z',
  })
  @IsDateString()
  date: string;
}
