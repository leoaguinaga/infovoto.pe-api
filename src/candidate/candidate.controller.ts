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
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post()
  create(
    @Body() createCandidateDto: CreateCandidateDto,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.create(createCandidateDto);
  }

  @Get()
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.candidateService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.update(id, updateCandidateDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.remove(id);
  }
}
