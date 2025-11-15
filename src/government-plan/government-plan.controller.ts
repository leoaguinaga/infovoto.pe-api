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
import { GovernmentPlanService } from './government-plan.service';
import { CreateGovernmentPlanDto } from './dto/create-government-plan.dto';
import { UpdateGovernmentPlanDto } from './dto/update-government-plan.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Government Plans')
@Controller('government-plans')
export class GovernmentPlanController {
  constructor(
    private readonly governmentPlanService: GovernmentPlanService,
  ) {}

  @HttpPost()
  @ApiOperation({ summary: 'Crear un nuevo plan de gobierno' })
  @ApiResponse({
    status: 201,
    description: 'Plan de gobierno creado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Agrupación política no encontrada',
  })
  create(
    @Body() createDto: CreateGovernmentPlanDto,
  ): Promise<ServiceResponse<any>> {
    return this.governmentPlanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los planes de gobierno' })
  @ApiResponse({
    status: 200,
    description: 'Listado de planes de gobierno obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.governmentPlanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un plan de gobierno por ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan de gobierno obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Plan de gobierno no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.governmentPlanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un plan de gobierno' })
  @ApiResponse({
    status: 200,
    description: 'Plan de gobierno actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Plan de gobierno o agrupación política asociada no encontrados',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGovernmentPlanDto,
  ): Promise<ServiceResponse<any>> {
    return this.governmentPlanService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un plan de gobierno' })
  @ApiResponse({
    status: 200,
    description: 'Plan de gobierno eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Plan de gobierno no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.governmentPlanService.remove(id);
  }
}
