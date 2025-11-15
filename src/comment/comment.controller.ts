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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @HttpPost()
  @ApiOperation({ summary: 'Crear un nuevo comentario en un post' })
  @ApiResponse({
    status: 201,
    description: 'Comentario creado correctamente',
  })
  create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<ServiceResponse<any>> {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los comentarios' })
  @ApiResponse({
    status: 200,
    description: 'Listado de comentarios obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.commentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un comentario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Comentario obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Comentario no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un comentario' })
  @ApiResponse({
    status: 200,
    description: 'Comentario actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Comentario no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<ServiceResponse<any>> {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un comentario' })
  @ApiResponse({
    status: 200,
    description: 'Comentario eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Comentario no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.commentService.remove(id);
  }
}
