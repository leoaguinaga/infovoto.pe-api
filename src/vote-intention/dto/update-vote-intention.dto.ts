import { PartialType } from '@nestjs/mapped-types';
import { CreateVoteIntentionDto } from './create-vote-intention.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateVoteIntentionDto extends PartialType(
  CreateVoteIntentionDto,
) {
  @ApiPropertyOptional({
    description: 'Nuevo ID de candidato (si se quiere cambiar)',
    example: 4,
  })
  @IsOptional()
  @IsInt()
  candidateId?: number;

  @ApiPropertyOptional({
    description: 'Nuevo ID de elección (si se quiere cambiar)',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  electionId?: number;

  @ApiPropertyOptional({
    description: 'Nuevo ID de usuario (normalmente no se cambia)',
    example: 6,
  })
  @IsOptional()
  @IsInt()
  userId?: number;
}
