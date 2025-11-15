import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from '../upload/upload.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly uploadService: UploadService,
  ) {}

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

  @HttpPost(':id/upload-images')
  @ApiOperation({ summary: 'Subir imágenes del comentario (hasta 3 imágenes)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Imágenes subidas correctamente',
  })
  @UseInterceptors(FilesInterceptor('files', 3, {
    storage: require('multer').diskStorage({
      destination: './uploads/comments',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = require('path').extname(file.originalname);
        callback(null, `image-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new Error('Solo se permiten archivos de imagen'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB por archivo
    },
  }))
  uploadImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedFiles = files.map(file => ({
      filename: file.filename,
      url: this.uploadService.getFileUrl('comments', file.filename),
    }));

    return {
      success: true,
      message: 'Imágenes subidas correctamente',
      data: {
        count: files.length,
        files: uploadedFiles,
      },
    };
  }
}
