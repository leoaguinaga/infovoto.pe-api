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
import { ElectionService } from './election.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Controller('elections')
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  @Post()
  create(
    @Body() createElectionDto: CreateElectionDto,
  ): Promise<ServiceResponse<any>> {
    return this.electionService.create(createElectionDto);
  }

  @Get()
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.electionService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.electionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateElectionDto: UpdateElectionDto,
  ): Promise<ServiceResponse<any>> {
    return this.electionService.update(id, updateElectionDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.electionService.remove(id);
  }
}
