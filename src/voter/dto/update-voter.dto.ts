import { PartialType } from '@nestjs/mapped-types';
import { CreateVoterDto } from './create-voter.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateVoterDto extends PartialType(CreateVoterDto) {
  @IsOptional()
  @IsInt()
  votingTableId?: number;
}
