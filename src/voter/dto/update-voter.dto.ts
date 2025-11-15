import { PartialType } from '@nestjs/mapped-types';
import { CreateVoterDto } from './create-voter.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateVoterDto extends PartialType(CreateVoterDto) {
  @ApiPropertyOptional({
    description: 'Nuevo número de documento del votante',
    example: '87654321',
  })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiPropertyOptional({
    description: 'Nueva mesa de votación asignada',
    example: 15,
  })
  @IsOptional()
  @IsInt()
  votingTableId?: number;

  @ApiPropertyOptional({
    description: 'Permite reasignar el usuario asociado (normalmente no cambia)',
    example: 6,
  })
  @IsOptional()
  @IsInt()
  userId?: number;
}
