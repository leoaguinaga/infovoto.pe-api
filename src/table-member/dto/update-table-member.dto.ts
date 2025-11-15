import { PartialType } from '@nestjs/mapped-types';
import { CreateTableMemberDto } from './create-table-member.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTableMemberDto extends PartialType(CreateTableMemberDto) {
  @ApiPropertyOptional({
    description: 'Nuevo ID de usuario asociado (normalmente no cambia)',
    example: 11,
  })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiPropertyOptional({
    description: 'Nueva mesa de votación donde ejercerá como miembro',
    example: 8,
  })
  @IsOptional()
  @IsInt()
  votingTableId?: number;

  @ApiPropertyOptional({
    description: 'Nuevo rol dentro de la mesa',
    example: 'Secretario',
  })
  @IsOptional()
  @IsString()
  roleInTable?: string;
}
