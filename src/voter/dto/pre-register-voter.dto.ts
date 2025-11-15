import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PreRegisterVoterDto {
  @ApiProperty({
    description: 'Nombre completo del votante',
    example: 'Juan Carlos Pérez García',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Número de documento del votante (DNI único)',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiPropertyOptional({
    description: 'ID de la mesa de votación asignada (opcional)',
    example: 12,
  })
  @IsOptional()
  @IsInt()
  votingTableId?: number;
}
