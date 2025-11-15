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
import { GuideContentService } from './guide-content.service';
import { CreateGuideContentDto } from './dto/create-guide-content.dto';
import { UpdateGuideContentDto } from './dto/update-guide-content.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Guide Contents')
@Controller('guide-contents')
export class GuideContentController {
  constructor(
    private readonly guideContentService: GuideContentService,
  ) {}

  @HttpPost()
  @ApiOperation({
    summary: 'Crear un nuevo contenido informativo (guía)',
  })
  @ApiResponse({
    status: 201,
    description: 'Contenido informativo creado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Elección asociada no encontrada',
  })
  create(
    @Body() createGuideContentDto: CreateGuideContentDto,
  ): Promise<ServiceResponse<any>> {
    return this.guideContentService.create(createGuideContentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los contenidos informativos',
  })
  @ApiResponse({
    status: 200,
    description:
      'Listado de contenidos informativos obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.guideContentService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un contenido informativo por ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Contenido informativo obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Contenido informativo no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.guideContentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un contenido informativo',
  })
  @ApiResponse({
    status: 200,
    description:
      'Contenido informativo actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Contenido informativo o elección asociada no encontrados',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGuideContentDto: UpdateGuideContentDto,
  ): Promise<ServiceResponse<any>> {
    return this.guideContentService.update(
      id,
      updateGuideContentDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un contenido informativo',
  })
  @ApiResponse({
    status: 200,
    description:
      'Contenido informativo eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Contenido informativo no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.guideContentService.remove(id);
  }
}
