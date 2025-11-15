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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  @ApiOperation({ summary: 'Crear un nuevo post de candidato' })
  @ApiResponse({
    status: 201,
    description: 'Post creado correctamente',
  })
  create(
    @Body() createPostDto: CreatePostDto,
  ): Promise<ServiceResponse<any>> {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los posts' })
  @ApiResponse({
    status: 200,
    description: 'Listado de posts obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.postService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un post por ID' })
  @ApiResponse({
    status: 200,
    description: 'Post obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Post no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un post existente' })
  @ApiResponse({
    status: 200,
    description: 'Post actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Post no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ServiceResponse<any>> {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un post' })
  @ApiResponse({
    status: 200,
    description: 'Post eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Post no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.postService.remove(id);
  }
}
