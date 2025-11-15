// src/political-group/dto/update-political-group.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePoliticalGroupDto } from './create-political-group.dto';

export class UpdatePoliticalGroupDto extends PartialType(
  CreatePoliticalGroupDto,
) {}
