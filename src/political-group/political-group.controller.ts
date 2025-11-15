// src/political-group/political-group.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PoliticalGroupService } from './political-group.service';
import { CreatePoliticalGroupDto } from './dto/create-political-group.dto';
import { UpdatePoliticalGroupDto } from './dto/update-political-group.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Controller('political-groups')
export class PoliticalGroupController {
  constructor(
    private readonly politicalGroupService: PoliticalGroupService,
  ) {}

  @Post()
  create(
    @Body() createPoliticalGroupDto: CreatePoliticalGroupDto,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.create(createPoliticalGroupDto);
  }

  @Get()
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.politicalGroupService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePoliticalGroupDto: UpdatePoliticalGroupDto,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.update(id, updatePoliticalGroupDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.remove(id);
  }
}
