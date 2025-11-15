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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from '../upload/upload.service';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly uploadService: UploadService,
  ) {}

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

  @HttpPost(':id/upload-images')
  @ApiOperation({ summary: 'Subir imágenes del post (hasta 5 imágenes)' })
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
  @UseInterceptors(FilesInterceptor('files', 5, {
    storage: require('multer').diskStorage({
      destination: './uploads/posts',
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
      url: this.uploadService.getFileUrl('posts', file.filename),
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
