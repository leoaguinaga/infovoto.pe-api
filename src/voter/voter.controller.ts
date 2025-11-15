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
import { VoterService } from './voter.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Controller('voters')
export class VoterController {
  constructor(private readonly voterService: VoterService) {}

  @Post()
  create(
    @Body() createVoterDto: CreateVoterDto,
  ): Promise<ServiceResponse<any>> {
    return this.voterService.create(createVoterDto);
  }

  @Get()
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.voterService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.voterService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVoterDto: UpdateVoterDto,
  ): Promise<ServiceResponse<any>> {
    return this.voterService.update(id, updateVoterDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.voterService.remove(id);
  }
}
