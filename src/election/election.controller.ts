import {
  Controller,
  Get,
  Post as HttpPost,
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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Elections')
@Controller('elections')
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  @HttpPost()
  @ApiOperation({ summary: 'Crear una nueva elección' })
  @ApiResponse({
    status: 201,
    description: 'Elección creada correctamente',
  })
  create(
    @Body() createElectionDto: CreateElectionDto,
  ): Promise<ServiceResponse<any>> {
    return this.electionService.create(createElectionDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todas las elecciones' })
  @ApiResponse({
    status: 200,
    description: 'Listado de elecciones obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.electionService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una elección por ID' })
  @ApiResponse({
    status: 200,
    description: 'Elección obtenida correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Elección no encontrada',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.electionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una elección' })
  @ApiResponse({
    status: 200,
    description: 'Elección actualizada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Elección no encontrada',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateElectionDto: UpdateElectionDto,
  ): Promise<ServiceResponse<any>> {
    return this.electionService.update(id, updateElectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una elección' })
  @ApiResponse({
    status: 200,
    description: 'Elección eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Elección no encontrada',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.electionService.remove(id);
  }
}
