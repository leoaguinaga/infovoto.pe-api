import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PoliticalGroupService } from './political-group.service';
import { CreatePoliticalGroupDto } from './dto/create-political-group.dto';
import { UpdatePoliticalGroupDto } from './dto/update-political-group.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from '../upload/upload.service';

@ApiTags('Political Groups')
@Controller('political-groups')
export class PoliticalGroupController {
  constructor(
    private readonly politicalGroupService: PoliticalGroupService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva agrupación política' })
  @ApiResponse({
    status: 201,
    description: 'Agrupación política creada correctamente',
  })
  create(
    @Body() createPoliticalGroupDto: CreatePoliticalGroupDto,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.create(createPoliticalGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las agrupaciones políticas' })
  @ApiResponse({
    status: 200,
    description:
      'Listado de agrupaciones políticas obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.politicalGroupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una agrupación política por ID' })
  @ApiResponse({
    status: 200,
    description: 'Agrupación política obtenida correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Agrupación política no encontrada',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una agrupación política' })
  @ApiResponse({
    status: 200,
    description: 'Agrupación política actualizada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Agrupación política no encontrada',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePoliticalGroupDto: UpdatePoliticalGroupDto,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.update(id, updatePoliticalGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una agrupación política' })
  @ApiResponse({
    status: 200,
    description: 'Agrupación política eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Agrupación política no encontrada',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.politicalGroupService.remove(id);
  }

  @Post(':id/upload-photo')
  @ApiOperation({ summary: 'Subir foto del partido político' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Foto subida correctamente',
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: require('multer').diskStorage({
      destination: './uploads/political-groups',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = require('path').extname(file.originalname);
        callback(null, `photo-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new Error('Solo se permiten archivos de imagen'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  uploadPhoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoUrl = this.uploadService.getFileUrl('political-groups', file.filename);
    return {
      success: true,
      message: 'Foto subida correctamente',
      data: {
        filename: file.filename,
        url: photoUrl,
      },
    };
  }
}
