import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVoterDto {
  @ApiProperty({
    description: 'ID del usuario asociado al votante (1:1 con User)',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Número de documento del votante (único)',
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
