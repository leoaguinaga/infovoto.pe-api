import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVotingTableDto {
  @ApiProperty({
    description: 'Código de la mesa de votación (único)',
    example: '054321',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'ID del local de votación al que pertenece la mesa',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  votingCenterId: number;

  @ApiPropertyOptional({
    description: 'Ambiente o aula donde se encuentra la mesa',
    example: 'Aula 304',
  })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiPropertyOptional({
    description: 'Piso donde se encuentra la mesa',
    example: '3er piso',
  })
  @IsOptional()
  @IsString()
  floor?: string;
}
