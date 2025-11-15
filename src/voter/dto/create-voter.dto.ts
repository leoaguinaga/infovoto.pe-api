import { IsInt, IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator';

export class CreateVoterDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  documentNumber: string;

  @IsOptional()
  @IsInt()
  votingTableId?: number;
}
