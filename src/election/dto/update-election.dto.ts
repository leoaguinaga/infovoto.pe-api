import { PartialType } from '@nestjs/mapped-types';
import { CreateElectionDto } from './create-election.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateElectionDto extends PartialType(CreateElectionDto) {
  @IsOptional()
  @IsDateString()
  date?: string;
}
