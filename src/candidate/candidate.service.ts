import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class CandidateService {
  constructor(private readonly prisma: PrismaService) {}

  // Qué incluimos siempre al devolver un candidato
  private readonly baseInclude = {
    politicalGroup: {
      select: {
        id: true,
        name: true,
        shortName: true,
        logoUrl: true,
      },
    },
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
    // opcional, puedes quitar si no quieres cargar tanto
    posts: true,
    voteIntentions: true,
  };

  async create(
    createCandidateDto: CreateCandidateDto,
  ): Promise<ServiceResponse<any>> {
    const {
      fullName,
      office,
      biography,
      photoUrl,
      politicalGroupId,
      userId,
    } = createCandidateDto;

    // 1. Validar que exista la agrupación política
    const group = await this.prisma.politicalGroup.findUnique({
      where: { id: politicalGroupId },
    });

    if (!group) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Agrupación política no encontrada',
        success: false,
        data: null,
      });
    }

    // 2. Si viene userId, validar usuario + unicidad de candidate.userId
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Usuario asociado al candidato no encontrado',
          success: false,
          data: null,
        });
      }

      const existingCandidateForUser = await this.prisma.candidate.findUnique({
        where: { userId },
      });

      if (existingCandidateForUser) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'Este usuario ya está asociado a otro candidato',
          success: false,
          data: null,
        });
      }
    }

    const candidate = await this.prisma.candidate.create({
      data: {
        fullName,
        office,
        biography,
        photoUrl,
        politicalGroupId,
        userId,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Candidato creado correctamente',
      success: true,
      data: candidate,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const candidates = await this.prisma.candidate.findMany({
      include: this.baseInclude,
      orderBy: {
        fullName: 'asc',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de candidatos obtenido correctamente',
      success: true,
      data: candidates,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!candidate) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Candidato no encontrado',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Candidato obtenido correctamente',
      success: true,
      data: candidate,
    };
  }

  async update(
    id: number,
    updateCandidateDto: UpdateCandidateDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.candidate.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Candidato no encontrado',
        success: false,
        data: null,
      });
    }

    const data: any = {
      fullName: updateCandidateDto.fullName,
      office: updateCandidateDto.office,
      biography: updateCandidateDto.biography,
      photoUrl: updateCandidateDto.photoUrl,
    };

    // Cambio de agrupación política
    if (updateCandidateDto.politicalGroupId !== undefined) {
      const group = await this.prisma.politicalGroup.findUnique({
        where: { id: updateCandidateDto.politicalGroupId },
      });

      if (!group) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Agrupación política no encontrada',
          success: false,
          data: null,
        });
      }

      data.politicalGroupId = updateCandidateDto.politicalGroupId;
    }

    // Cambio de usuario asociado
    if (updateCandidateDto.userId !== undefined) {
      if (updateCandidateDto.userId === null) {
        // si llegas a permitir null en DTO, podrías soltar la relación
        data.userId = null;
      } else {
        const user = await this.prisma.user.findUnique({
          where: { id: updateCandidateDto.userId },
        });

        if (!user) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Usuario asociado al candidato no encontrado',
            success: false,
            data: null,
          });
        }

        const existingCandidateForUser =
          await this.prisma.candidate.findUnique({
            where: { userId: updateCandidateDto.userId },
          });

        if (
          existingCandidateForUser &&
          existingCandidateForUser.id !== id
        ) {
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
            message: 'Este usuario ya está asociado a otro candidato',
            success: false,
            data: null,
          });
        }

        data.userId = updateCandidateDto.userId;
      }
    }

    // limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const candidate = await this.prisma.candidate.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Candidato actualizado correctamente',
      success: true,
      data: candidate,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.candidate.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Candidato no encontrado',
        success: false,
        data: null,
      });
    }

    await this.prisma.candidate.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Candidato eliminado correctamente',
      success: true,
      data: existing,
    };
  }
}
