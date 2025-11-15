import { PartialType } from '@nestjs/mapped-types';
import { CreateVotingTableDto } from './create-voting-table.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateVotingTableDto extends PartialType(CreateVotingTableDto) {
  @ApiPropertyOptional({
    description: 'Código de la mesa de votación (único)',
    example: '054321-A',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'ID del local de votación al que pertenece la mesa',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  votingCenterId?: number;

  @ApiPropertyOptional({
    description: 'Ambiente o aula donde se encuentra la mesa',
    example: 'Aula 305',
  })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiPropertyOptional({
    description: 'Piso donde se encuentra la mesa',
    example: '2do piso',
  })
  @IsOptional()
  @IsString()
  floor?: string;
}
