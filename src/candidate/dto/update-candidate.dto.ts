import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateDto } from './create-candidate.dto';
import { IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {
  @ApiPropertyOptional({
    description:
      'Nuevo ID de usuario dueño de la cuenta del candidato (normalmente no cambia)',
    example: 20,
  })
  @IsOptional()
  @IsInt()
  userId?: number;
}
