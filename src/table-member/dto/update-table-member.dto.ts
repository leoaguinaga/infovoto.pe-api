// src/table-member/dto/update-table-member.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTableMemberDto {
  @IsOptional()
  @IsInt()
  votingTableId?: number;

  @IsOptional()
  @IsString()
  roleInTable?: string;
}
