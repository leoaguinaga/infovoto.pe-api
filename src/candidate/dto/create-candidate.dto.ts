import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CandidateOffice } from 'generated/prisma/client';

export class CreateCandidateDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(CandidateOffice)
  office: CandidateOffice;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsInt()
  @IsNotEmpty()
  politicalGroupId: number;

  @IsOptional()
  @IsInt()
  userId?: number; // usuario dueño de la cuenta del candidato (para posts, etc.)
}
