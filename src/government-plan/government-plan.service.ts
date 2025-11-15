import { Injectable } from '@nestjs/common';
import { CreateGovernmentPlanDto } from './dto/create-government-plan.dto';
import { UpdateGovernmentPlanDto } from './dto/update-government-plan.dto';

@Injectable()
export class GovernmentPlanService {
  create(createGovernmentPlanDto: CreateGovernmentPlanDto) {
    return 'This action adds a new governmentPlan';
  }

  findAll() {
    return `This action returns all governmentPlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} governmentPlan`;
  }

  update(id: number, updateGovernmentPlanDto: UpdateGovernmentPlanDto) {
    return `This action updates a #${id} governmentPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} governmentPlan`;
  }
}
