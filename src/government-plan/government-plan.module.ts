import { Module } from '@nestjs/common';
import { GovernmentPlanService } from './government-plan.service';
import { GovernmentPlanController } from './government-plan.controller';

@Module({
  controllers: [GovernmentPlanController],
  providers: [GovernmentPlanService],
})
export class GovernmentPlanModule {}
