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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Candidates')
@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo candidato' })
  @ApiResponse({
    status: 201,
    description: 'Candidato creado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Agrupación política o usuario asociado no encontrados (si lo validas)',
  })
  create(
    @Body() createCandidateDto: CreateCandidateDto,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.create(createCandidateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los candidatos' })
  @ApiResponse({
    status: 200,
    description: 'Listado de candidatos obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.candidateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un candidato por ID' })
  @ApiResponse({
    status: 200,
    description: 'Candidato obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidato no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un candidato' })
  @ApiResponse({
    status: 200,
    description: 'Candidato actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Candidato, agrupación política o usuario asociado no encontrados',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.update(id, updateCandidateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un candidato' })
  @ApiResponse({
    status: 200,
    description: 'Candidato eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidato no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.remove(id);
  }
}
