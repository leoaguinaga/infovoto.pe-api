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
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VotingCenterService } from './voting-center.service';
import { CreateVotingCenterDto } from './dto/create-voting-center.dto';
import { UpdateVotingCenterDto } from './dto/update-voting-center.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from '../upload/upload.service';

@ApiTags('Voting Centers')
@Controller('voting-centers')
export class VotingCenterController {
  constructor(
    private readonly votingCenterService: VotingCenterService,
    private readonly uploadService: UploadService,
  ) {}

  @HttpPost()
  @ApiOperation({ summary: 'Crear un nuevo local de votación' })
  @ApiResponse({
    status: 201,
    description: 'Local de votación creado correctamente',
  })
  create(
    @Body() createVotingCenterDto: CreateVotingCenterDto,
  ): Promise<ServiceResponse<any>> {
    return this.votingCenterService.create(createVotingCenterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los locales de votación' })
  @ApiResponse({
    status: 200,
    description:
      'Listado de locales de votación obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.votingCenterService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un local de votación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Local de votación obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Local de votación no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.votingCenterService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un local de votación' })
  @ApiResponse({
    status: 200,
    description: 'Local de votación actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Local de votación no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVotingCenterDto: UpdateVotingCenterDto,
  ): Promise<ServiceResponse<any>> {
    return this.votingCenterService.update(
      id,
      updateVotingCenterDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un local de votación' })
  @ApiResponse({
    status: 200,
    description: 'Local de votación eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Local de votación no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.votingCenterService.remove(id);
  }

  @HttpPost(':id/upload-sketch')
  @ApiOperation({ summary: 'Subir croquis del local de votación' })
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
    description: 'Croquis subido correctamente',
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: require('multer').diskStorage({
      destination: './uploads/voting-centers',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = require('path').extname(file.originalname);
        callback(null, `sketch-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/)) {
        return callback(new Error('Solo se permiten imágenes o PDF'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  uploadSketch(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const sketchUrl = this.uploadService.getFileUrl('voting-centers', file.filename);
    this.votingCenterService.update(id, { sketchUrl });
    return {
      success: true,
      message: 'Croquis subido correctamente',
      data: {
        filename: file.filename,
        url: sketchUrl,
      },
    };
  }
}
