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
import { PoliticalGroupService } from './political-group.service';
import { CreatePoliticalGroupDto } from './dto/create-political-group.dto';
import { UpdatePoliticalGroupDto } from './dto/update-political-group.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Political Groups')
@Controller('political-groups')
export class PoliticalGroupController {
  constructor(
    private readonly politicalGroupService: PoliticalGroupService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva agrupación política' })
  @ApiResponse({
    status: 201,
    description: 'Agrupación política creada correctamente',
  })
  create(
    @Body() createPoliticalGroupDto: CreatePoliticalGroupDto,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.create(createPoliticalGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las agrupaciones políticas' })
  @ApiResponse({
    status: 200,
    description:
      'Listado de agrupaciones políticas obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.politicalGroupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una agrupación política por ID' })
  @ApiResponse({
    status: 200,
    description: 'Agrupación política obtenida correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Agrupación política no encontrada',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una agrupación política' })
  @ApiResponse({
    status: 200,
    description: 'Agrupación política actualizada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Agrupación política no encontrada',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePoliticalGroupDto: UpdatePoliticalGroupDto,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.update(id, updatePoliticalGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una agrupación política' })
  @ApiResponse({
    status: 200,
    description: 'Agrupación política eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Agrupación política no encontrada',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.remove(id);
  }
}
