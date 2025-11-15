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
import { VoterService } from './voter.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { PreRegisterVoterDto } from './dto/pre-register-voter.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Voters')
@Controller('voters')
export class VoterController {
  constructor(private readonly voterService: VoterService) {}

  @Public()
  @HttpPost('pre-register')
  @ApiOperation({ 
    summary: 'Pre-registrar votante con DNI',
    description: 'Crea un usuario inactivo y su perfil de votante. El votante debe luego activar su cuenta con email.'
  })
  @ApiResponse({
    status: 201,
    description: 'Votante pre-registrado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Mesa de votación no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'El documento de identidad ya está registrado',
  })
  preRegister(
    @Body() preRegisterVoterDto: PreRegisterVoterDto,
  ): Promise<ServiceResponse<any>> {
    return this.voterService.preRegister(preRegisterVoterDto);
  }

  @HttpPost()
  @ApiOperation({ summary: 'Crear un nuevo votante' })
  @ApiResponse({
    status: 201,
    description: 'Votante creado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o mesa de votación no encontrados',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ya existe un votante para ese usuario o documento',
  })
  create(
    @Body() createVoterDto: CreateVoterDto,
  ): Promise<ServiceResponse<any>> {
    return this.voterService.create(createVoterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los votantes' })
  @ApiResponse({
    status: 200,
    description: 'Listado de votantes obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.voterService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un votante por ID' })
  @ApiResponse({
    status: 200,
    description: 'Votante obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Votante no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.voterService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un votante' })
  @ApiResponse({
    status: 200,
    description: 'Votante actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Votante, usuario o mesa de votación no encontrados',
  })
  @ApiResponse({
    status: 409,
    description:
      'Documento o combinación usuario/votante ya registrada',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVoterDto: UpdateVoterDto,
  ): Promise<ServiceResponse<any>> {
    return this.voterService.update(id, updateVoterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un votante' })
  @ApiResponse({
    status: 200,
    description: 'Votante eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Votante no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.voterService.remove(id);
  }
}
