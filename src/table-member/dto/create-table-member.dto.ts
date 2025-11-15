// src/table-member/dto/create-table-member.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTableMemberDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  votingTableId: number;

  @IsOptional()
  @IsString()
  roleInTable?: string; // presidente, secretario, tercer miembro, etc.
}
