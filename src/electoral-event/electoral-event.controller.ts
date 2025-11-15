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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Electoral Events')
@Controller('electoral-events')
export class ElectoralEventController {
  constructor(
    private readonly electoralEventService: ElectoralEventService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo evento electoral' })
  @ApiResponse({
    status: 201,
    description: 'Evento electoral creado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Elección asociada no encontrada (si lo validas en el service)',
  })
  create(
    @Body() createElectoralEventDto: CreateElectoralEventDto,
  ): Promise<ServiceResponse<any>> {
    return this.electoralEventService.create(createElectoralEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los eventos electorales' })
  @ApiResponse({
    status: 200,
    description:
      'Listado de eventos electorales obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.electoralEventService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento electoral por ID' })
  @ApiResponse({
    status: 200,
    description: 'Evento electoral obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento electoral no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.electoralEventService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un evento electoral' })
  @ApiResponse({
    status: 200,
    description: 'Evento electoral actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento electoral o elección asociada no encontrados',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateElectoralEventDto: UpdateElectoralEventDto,
  ): Promise<ServiceResponse<any>> {
    return this.electoralEventService.update(id, updateElectoralEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un evento electoral' })
  @ApiResponse({
    status: 200,
    description: 'Evento electoral eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento electoral no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.electoralEventService.remove(id);
  }
}
