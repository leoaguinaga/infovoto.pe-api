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
import { VotingTableService } from './voting-table.service';
import { CreateVotingTableDto } from './dto/create-voting-table.dto';
import { UpdateVotingTableDto } from './dto/update-voting-table.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Voting Tables')
@Controller('voting-tables')
export class VotingTableController {
  constructor(
    private readonly votingTableService: VotingTableService,
  ) {}

  @HttpPost()
  @ApiOperation({ summary: 'Crear una nueva mesa de votación' })
  @ApiResponse({
    status: 201,
    description: 'Mesa de votación creada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Local de votación no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una mesa con ese código',
  })
  create(
    @Body() createVotingTableDto: CreateVotingTableDto,
  ): Promise<ServiceResponse<any>> {
    return this.votingTableService.create(createVotingTableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las mesas de votación' })
  @ApiResponse({
    status: 200,
    description:
      'Listado de mesas de votación obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.votingTableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una mesa de votación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Mesa de votación obtenida correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa de votación no encontrada',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.votingTableService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una mesa de votación' })
  @ApiResponse({
    status: 200,
    description: 'Mesa de votación actualizada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa o local de votación no encontrados',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe otra mesa con ese código',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVotingTableDto: UpdateVotingTableDto,
  ): Promise<ServiceResponse<any>> {
    return this.votingTableService.update(id, updateVotingTableDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una mesa de votación' })
  @ApiResponse({
    status: 200,
    description: 'Mesa de votación eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa de votación no encontrada',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.votingTableService.remove(id);
  }
}
