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
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from '../upload/upload.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Candidates')
@Controller('candidates')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo candidato' })
  @ApiResponse({
    status: 201,
    description: 'Candidato creado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Agrupación política o usuario asociado no encontrados (si lo validas)',
  })
  create(
    @Body() createCandidateDto: CreateCandidateDto,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.create(createCandidateDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los candidatos' })
  @ApiResponse({
    status: 200,
    description: 'Listado de candidatos obtenido correctamente',
  })
  findAll(): Promise<ServiceResponse<any[]>> {
    return this.candidateService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un candidato por ID' })
  @ApiResponse({
    status: 200,
    description: 'Candidato obtenido correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidato no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un candidato' })
  @ApiResponse({
    status: 200,
    description: 'Candidato actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description:
      'Candidato, agrupación política o usuario asociado no encontrados',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.update(id, updateCandidateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un candidato' })
  @ApiResponse({
    status: 200,
    description: 'Candidato eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidato no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.remove(id);
  }

  @Post(':id/upload-photo')
  @ApiOperation({ summary: 'Subir foto del candidato' })
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
      destination: './uploads/candidates',
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
    const photoUrl = this.uploadService.getFileUrl('candidates', file.filename);
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
