import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ElectoralEventCategory } from 'generated/prisma/client';

export class CreateElectoralEventDto {
  @IsInt()
  @IsNotEmpty()
  electionId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string; // lo convertimos a Date en el service

  @IsEnum(ElectoralEventCategory)
  category: ElectoralEventCategory;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
