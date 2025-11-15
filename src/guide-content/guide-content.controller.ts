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
import { GuideContentService } from './guide-content.service';
import { CreateGuideContentDto } from './dto/create-guide-content.dto';
import { UpdateGuideContentDto } from './dto/update-guide-content.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from '../upload/upload.service';

@ApiTags('Guide Contents')
@Controller('guide-contents')
export class GuideContentController {
  constructor(
    private readonly guideContentService: GuideContentService,
    private readonly uploadService: UploadService,
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

  @HttpPost(':id/upload-images')
  @ApiOperation({ summary: 'Subir imágenes del contenido de guía (hasta 5 imágenes)' })
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
      destination: './uploads/guide-contents',
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
      url: this.uploadService.getFileUrl('guide-contents', file.filename),
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
