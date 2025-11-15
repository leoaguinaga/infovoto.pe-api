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
import { NewsItemService } from './news-item.service';
import { CreateNewsItemDto } from './dto/create-news-item.dto';
import { UpdateNewsItemDto } from './dto/update-news-item.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('News Items')
@Controller('news-items')
export class NewsItemController {
  constructor(private readonly newsItemService: NewsItemService) {}

  @HttpPost()
  @ApiOperation({ summary: 'Crear una nueva noticia' })
  @ApiResponse({
    status: 201,
    description: 'Noticia creada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Elección o agrupación política asociada no encontrada',
  })
  create(
    @Body() createNewsItemDto: CreateNewsItemDto,
  ): Promise<ServiceResponse<any>> {
    return this.newsItemService.create(createNewsItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las noticias' })
  @ApiResponse({
    status: 200,
    description: 'Listado de noticias obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.newsItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una noticia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Noticia obtenida correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Noticia no encontrada',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.newsItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una noticia' })
  @ApiResponse({
    status: 200,
    description: 'Noticia actualizada correctamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Noticia, elección o agrupación política asociada no encontrada',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsItemDto: UpdateNewsItemDto,
  ): Promise<ServiceResponse<any>> {
    return this.newsItemService.update(id, updateNewsItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una noticia' })
  @ApiResponse({
    status: 200,
    description: 'Noticia eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Noticia no encontrada',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.newsItemService.remove(id);
  }
}
