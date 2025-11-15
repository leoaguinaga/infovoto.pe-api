import { PartialType } from '@nestjs/mapped-types';
import { CreateGovernmentPlanDto } from './create-government-plan.dto';

export class UpdateGovernmentPlanDto extends PartialType(CreateGovernmentPlanDto) {}
