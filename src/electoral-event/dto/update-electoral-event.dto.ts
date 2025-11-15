import { PartialType } from '@nestjs/mapped-types';
import { CreateElectoralEventDto } from './create-electoral-event.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateElectoralEventDto extends PartialType(
  CreateElectoralEventDto,
) {
  @IsOptional()
  @IsDateString()
  date?: string;
}
