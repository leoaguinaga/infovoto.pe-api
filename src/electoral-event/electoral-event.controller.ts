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
import { ElectoralEventService } from './electoral-event.service';
import { CreateElectoralEventDto } from './dto/create-electoral-event.dto';
import { UpdateElectoralEventDto } from './dto/update-electoral-event.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Controller('electoral-events')
export class ElectoralEventController {
  constructor(
    private readonly electoralEventService: ElectoralEventService,
  ) {}

  @Post()
  create(
    @Body() createElectoralEventDto: CreateElectoralEventDto,
  ): Promise<ServiceResponse<any>> {
    return this.electoralEventService.create(createElectoralEventDto);
  }

  @Get()
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.electoralEventService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.electoralEventService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateElectoralEventDto: UpdateElectoralEventDto,
  ): Promise<ServiceResponse<any>> {
    return this.electoralEventService.update(id, updateElectoralEventDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.electoralEventService.remove(id);
  }
}
