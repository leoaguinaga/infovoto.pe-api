import { PartialType } from '@nestjs/mapped-types';
import { CreateElectoralEventDto } from './create-electoral-event.dto';
import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateElectoralEventDto extends PartialType(
  CreateElectoralEventDto,
) {
  @ApiPropertyOptional({
    description: 'Nueva fecha y hora del evento (formato ISO 8601)',
    example: '2025-12-20T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
