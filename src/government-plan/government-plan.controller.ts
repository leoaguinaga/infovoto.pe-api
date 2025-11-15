import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GovernmentPlanService } from './government-plan.service';
import { CreateGovernmentPlanDto } from './dto/create-government-plan.dto';
import { UpdateGovernmentPlanDto } from './dto/update-government-plan.dto';

@Controller('government-plan')
export class GovernmentPlanController {
  constructor(private readonly governmentPlanService: GovernmentPlanService) {}

  @Post()
  create(@Body() createGovernmentPlanDto: CreateGovernmentPlanDto) {
    return this.governmentPlanService.create(createGovernmentPlanDto);
  }

  @Get()
  findAll() {
    return this.governmentPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.governmentPlanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGovernmentPlanDto: UpdateGovernmentPlanDto) {
    return this.governmentPlanService.update(+id, updateGovernmentPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.governmentPlanService.remove(+id);
  }
}
