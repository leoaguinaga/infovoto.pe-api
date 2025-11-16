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
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { CreateAssetDeclarationDto } from './dto/create-asset-declaration.dto';
import { CreateInvestigationDto } from './dto/create-investigation.dto';
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

  // =====================
  // WORK EXPERIENCE
  // =====================

  @Post(':id/work-experience')
  @ApiOperation({ summary: 'Agregar experiencia laboral al candidato' })
  @ApiResponse({
    status: 201,
    description: 'Experiencia laboral agregada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidato no encontrado',
  })
  addWorkExperience(
    @Param('id', ParseIntPipe) candidateId: number,
    @Body() dto: CreateWorkExperienceDto,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.addWorkExperience(candidateId, dto);
  }

  @Patch('work-experience/:id')
  @ApiOperation({ summary: 'Actualizar experiencia laboral' })
  @ApiResponse({
    status: 200,
    description: 'Experiencia laboral actualizada correctamente',
  })
  updateWorkExperience(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateWorkExperienceDto>,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.updateWorkExperience(id, dto);
  }

  @Delete('work-experience/:id')
  @ApiOperation({ summary: 'Eliminar experiencia laboral' })
  @ApiResponse({
    status: 200,
    description: 'Experiencia laboral eliminada correctamente',
  })
  deleteWorkExperience(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.deleteWorkExperience(id);
  }

  // =====================
  // EDUCATION
  // =====================

  @Post(':id/education')
  @ApiOperation({ summary: 'Agregar formación académica al candidato' })
  @ApiResponse({
    status: 201,
    description: 'Formación académica agregada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidato no encontrado',
  })
  addEducation(
    @Param('id', ParseIntPipe) candidateId: number,
    @Body() dto: CreateEducationDto,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.addEducation(candidateId, dto);
  }

  @Patch('education/:id')
  @ApiOperation({ summary: 'Actualizar formación académica' })
  @ApiResponse({
    status: 200,
    description: 'Formación académica actualizada correctamente',
  })
  updateEducation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateEducationDto>,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.updateEducation(id, dto);
  }

  @Delete('education/:id')
  @ApiOperation({ summary: 'Eliminar formación académica' })
  @ApiResponse({
    status: 200,
    description: 'Formación académica eliminada correctamente',
  })
  deleteEducation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.deleteEducation(id);
  }

  // =====================
  // ASSET DECLARATIONS
  // =====================

  @Post(':id/asset-declarations')
  @ApiOperation({ summary: 'Agregar declaración patrimonial al candidato' })
  @ApiResponse({
    status: 201,
    description: 'Declaración patrimonial agregada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidato no encontrado',
  })
  addAssetDeclaration(
    @Param('id', ParseIntPipe) candidateId: number,
    @Body() dto: CreateAssetDeclarationDto,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.addAssetDeclaration(candidateId, dto);
  }

  @Patch('asset-declarations/:id')
  @ApiOperation({ summary: 'Actualizar declaración patrimonial' })
  @ApiResponse({
    status: 200,
    description: 'Declaración patrimonial actualizada correctamente',
  })
  updateAssetDeclaration(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateAssetDeclarationDto>,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.updateAssetDeclaration(id, dto);
  }

  @Delete('asset-declarations/:id')
  @ApiOperation({ summary: 'Eliminar declaración patrimonial' })
  @ApiResponse({
    status: 200,
    description: 'Declaración patrimonial eliminada correctamente',
  })
  deleteAssetDeclaration(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.deleteAssetDeclaration(id);
  }

  // =====================
  // INVESTIGATIONS
  // =====================

  @Post(':id/investigations')
  @ApiOperation({ summary: 'Agregar investigación al candidato' })
  @ApiResponse({
    status: 201,
    description: 'Investigación agregada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidato no encontrado',
  })
  addInvestigation(
    @Param('id', ParseIntPipe) candidateId: number,
    @Body() dto: CreateInvestigationDto,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.addInvestigation(candidateId, dto);
  }

  @Patch('investigations/:id')
  @ApiOperation({ summary: 'Actualizar investigación' })
  @ApiResponse({
    status: 200,
    description: 'Investigación actualizada correctamente',
  })
  updateInvestigation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateInvestigationDto>,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.updateInvestigation(id, dto);
  }

  @Delete('investigations/:id')
  @ApiOperation({ summary: 'Eliminar investigación' })
  @ApiResponse({
    status: 200,
    description: 'Investigación eliminada correctamente',
  })
  deleteInvestigation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponse<any>> {
    return this.candidateService.deleteInvestigation(id);
  }
}
