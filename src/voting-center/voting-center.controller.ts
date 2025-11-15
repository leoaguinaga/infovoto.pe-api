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
import { VotingCenterService } from './voting-center.service';
import { CreateVotingCenterDto } from './dto/create-voting-center.dto';
import { UpdateVotingCenterDto } from './dto/update-voting-center.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Voting Centers')
@Controller('voting-centers')
export class VotingCenterController {
  constructor(
    private readonly votingCenterService: VotingCenterService,
  ) {}

  @HttpPost()
  @ApiOperation({ summary: 'Crear un nuevo local de votación' })
  @ApiResponse({
    status: 201,
    description: 'Local de votación creado correctamente',
  })
  create(
    @Body() createVotingCenterDto: CreateVotingCenterDto,
  ): Promise<ServiceResponse<any>> {
    return this.votingCenterService.create(createVotingCenterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los locales de votación' })
  @ApiResponse({
    status: 200,
    description:
      'Listado de locales de votación obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.votingCenterService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un local de votación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Local de votación obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Local de votación no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.votingCenterService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un local de votación' })
  @ApiResponse({
    status: 200,
    description: 'Local de votación actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Local de votación no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVotingCenterDto: UpdateVotingCenterDto,
  ): Promise<ServiceResponse<any>> {
    return this.votingCenterService.update(
      id,
      updateVotingCenterDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un local de votación' })
  @ApiResponse({
    status: 200,
    description: 'Local de votación eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Local de votación no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.votingCenterService.remove(id);
  }
}
