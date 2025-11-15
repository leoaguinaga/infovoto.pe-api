import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ElectionType } from 'generated/prisma/client';

export class CreateElectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ElectionType)
  type: ElectionType;

  @IsDateString()
  date: string; // se convertirá a Date en el service
}
