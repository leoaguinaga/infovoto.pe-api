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
import { PostModerationAlertService } from './post-moderation-alert.service';
import { CreatePostModerationAlertDto } from './dto/create-post-moderation-alert.dto';
import { UpdatePostModerationAlertDto } from './dto/update-post-moderation-alert.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Post Moderation Alerts')
@Controller('post-moderation-alerts')
export class PostModerationAlertController {
  constructor(
    private readonly postModerationAlertService: PostModerationAlertService,
  ) {}

  @HttpPost()
  @ApiOperation({
    summary:
      'Crear una alerta de moderación para un post (trigger de IA)',
  })
  @ApiResponse({
    status: 201,
    description: 'Alerta de moderación creada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Post no encontrado',
  })
  create(
    @Body() createDto: CreatePostModerationAlertDto,
  ): Promise<ServiceResponse<any>> {
    return this.postModerationAlertService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las alertas de moderación' })
  @ApiResponse({
    status: 200,
    description:
      'Listado de alertas de moderación obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.postModerationAlertService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una alerta de moderación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Alerta de moderación obtenida correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Alerta de moderación no encontrada',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.postModerationAlertService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Actualizar una alerta de moderación (revisión por un admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Alerta de moderación actualizada correctamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Alerta de moderación o administrador no encontrados',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePostModerationAlertDto,
  ): Promise<ServiceResponse<any>> {
    return this.postModerationAlertService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una alerta de moderación' })
  @ApiResponse({
    status: 200,
    description: 'Alerta de moderación eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Alerta de moderación no encontrada',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.postModerationAlertService.remove(id);
  }
}
