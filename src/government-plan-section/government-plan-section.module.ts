import { Module } from '@nestjs/common';
import { GovernmentPlanSectionService } from './government-plan-section.service';
import { GovernmentPlanSectionController } from './government-plan-section.controller';

@Module({
  controllers: [GovernmentPlanSectionController],
  providers: [GovernmentPlanSectionService],
})
export class GovernmentPlanSectionModule {}
