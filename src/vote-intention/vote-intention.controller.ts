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
import { VoteIntentionService } from './vote-intention.service';
import { CreateVoteIntentionDto } from './dto/create-vote-intention.dto';
import { UpdateVoteIntentionDto } from './dto/update-vote-intention.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Vote Intentions')
@Controller('vote-intentions')
export class VoteIntentionController {
  constructor(
    private readonly voteIntentionService: VoteIntentionService,
  ) {}

  @HttpPost()
  @ApiOperation({ summary: 'Registrar una intención de voto' })
  @ApiResponse({
    status: 201,
    description: 'Intención de voto registrada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario, candidato o elección no encontrados',
  })
  @ApiResponse({
    status: 409,
    description:
      'La intención de voto ya existe para este usuario, candidato y elección',
  })
  create(
    @Body() createVoteIntentionDto: CreateVoteIntentionDto,
  ): Promise<ServiceResponse<any>> {
    return this.voteIntentionService.create(createVoteIntentionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las intenciones de voto' })
  @ApiResponse({
    status: 200,
    description:
      'Listado de intenciones de voto obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.voteIntentionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una intención de voto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Intención de voto obtenida correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Intención de voto no encontrada',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.voteIntentionService.findOne(id);
  }

  @Get('user/:userId/election/:electionId')
  @ApiOperation({ 
    summary: 'Obtener intenciones de voto de un usuario en una elección específica',
    description: 'Retorna todas las intenciones de voto registradas por un usuario para una elección determinada'
  })
  @ApiResponse({
    status: 200,
    description: 'Intenciones de voto obtenidas correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o elección no encontrados',
  })
  findByUserAndElection(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('electionId', ParseIntPipe) electionId: number,
  ): Promise<ServiceResponse<any[]>> {
    return this.voteIntentionService.findByUserAndElection(userId, electionId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una intención de voto' })
  @ApiResponse({
    status: 200,
    description: 'Intención de voto actualizada correctamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Intención de voto, usuario, candidato o elección no encontrados',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ya existe otra intención de voto con este usuario, elección y candidato',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVoteIntentionDto: UpdateVoteIntentionDto,
  ): Promise<ServiceResponse<any>> {
    return this.voteIntentionService.update(id, updateVoteIntentionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una intención de voto' })
  @ApiResponse({
    status: 200,
    description: 'Intención de voto eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Intención de voto no encontrada',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.voteIntentionService.remove(id);
  }
}
