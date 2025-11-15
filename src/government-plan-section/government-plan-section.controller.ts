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
import { GovernmentPlanSectionService } from './government-plan-section.service';
import { CreateGovernmentPlanSectionDto } from './dto/create-government-plan-section.dto';
import { UpdateGovernmentPlanSectionDto } from './dto/update-government-plan-section.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Government Plan Sections')
@Controller('government-plan-sections')
export class GovernmentPlanSectionController {
  constructor(
    private readonly governmentPlanSectionService: GovernmentPlanSectionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva sección de un plan de gobierno',
  })
  @ApiResponse({
    status: 201,
    description: 'Sección creada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Plan de gobierno asociado no encontrado',
  })
  create(
    @Body() createDto: CreateGovernmentPlanSectionDto,
  ): Promise<ServiceResponse<any>> {
    return this.governmentPlanSectionService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las secciones de planes de gobierno',
  })
  @ApiResponse({
    status: 200,
    description:
      'Listado de secciones de planes de gobierno obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.governmentPlanSectionService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una sección de plan de gobierno por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Sección obtenida correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Sección no encontrada',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.governmentPlanSectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una sección de un plan de gobierno',
  })
  @ApiResponse({
    status: 200,
    description: 'Sección actualizada correctamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Sección o plan de gobierno asociado no encontrados',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGovernmentPlanSectionDto,
  ): Promise<ServiceResponse<any>> {
    return this.governmentPlanSectionService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una sección de un plan de gobierno',
  })
  @ApiResponse({
    status: 200,
    description: 'Sección eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Sección no encontrada',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.governmentPlanSectionService.remove(id);
  }
}
