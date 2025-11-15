import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTableMemberDto {
  @ApiProperty({
    description: 'ID del usuario asociado al miembro de mesa (1:1 con User)',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID de la mesa de votación donde ejercerá como miembro',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  votingTableId: number;

  @ApiPropertyOptional({
    description: 'Rol dentro de la mesa (presidente, secretario, tercer miembro, etc.)',
    example: 'Presidente',
  })
  @IsOptional()
  @IsString()
  roleInTable?: string;
}
