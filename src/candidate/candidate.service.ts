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
    workExperience: {
      orderBy: {
        order: 'asc' as const,
      },
    },
    education: {
      orderBy: {
        order: 'asc' as const,
      },
    },
    assetDeclarations: {
      orderBy: {
        year: 'desc' as const,
      },
    },
    investigations: {
      orderBy: {
        createdAt: 'desc' as const,
      },
    },
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
      include: {
        ...this.baseInclude,
        politicalGroup: {
          include: {
            governmentPlans: {
              include: {
                sections: true,
              }
            },
          }
        },
        posts: {
          orderBy: { createdAt: 'desc' as const }
        }
      },
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

  // =====================
  // WORK EXPERIENCE
  // =====================

  async addWorkExperience(candidateId: number, data: any): Promise<ServiceResponse<any>> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Candidato no encontrado',
        success: false,
        data: null,
      });
    }

    const workExperience = await this.prisma.workExperience.create({
      data: {
        candidateId,
        position: data.position,
        company: data.company,
        startYear: data.startYear,
        endYear: data.endYear,
        isCurrent: data.isCurrent,
        description: data.description,
        order: data.order,
      },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Experiencia laboral agregada correctamente',
      success: true,
      data: workExperience,
    };
  }

  async updateWorkExperience(id: number, data: any): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.workExperience.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Experiencia laboral no encontrada',
        success: false,
        data: null,
      });
    }

    const workExperience = await this.prisma.workExperience.update({
      where: { id },
      data,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Experiencia laboral actualizada correctamente',
      success: true,
      data: workExperience,
    };
  }

  async deleteWorkExperience(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.workExperience.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Experiencia laboral no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.workExperience.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Experiencia laboral eliminada correctamente',
      success: true,
      data: existing,
    };
  }

  // =====================
  // EDUCATION
  // =====================

  async addEducation(candidateId: number, data: any): Promise<ServiceResponse<any>> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Candidato no encontrado',
        success: false,
        data: null,
      });
    }

    const education = await this.prisma.education.create({
      data: {
        candidateId,
        level: data.level,
        degree: data.degree,
        institution: data.institution,
        graduationYear: data.graduationYear,
        fieldOfStudy: data.fieldOfStudy,
        order: data.order,
      },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Formación académica agregada correctamente',
      success: true,
      data: education,
    };
  }

  async updateEducation(id: number, data: any): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Formación académica no encontrada',
        success: false,
        data: null,
      });
    }

    const education = await this.prisma.education.update({
      where: { id },
      data,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Formación académica actualizada correctamente',
      success: true,
      data: education,
    };
  }

  async deleteEducation(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Formación académica no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.education.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Formación académica eliminada correctamente',
      success: true,
      data: existing,
    };
  }

  // =====================
  // ASSET DECLARATIONS
  // =====================

  async addAssetDeclaration(candidateId: number, data: any): Promise<ServiceResponse<any>> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Candidato no encontrado',
        success: false,
        data: null,
      });
    }

    const assetDeclaration = await this.prisma.assetDeclaration.create({
      data: {
        candidateId,
        year: data.year,
        declaredIncome: data.declaredIncome,
        currency: data.currency || 'PEN',
        source: data.source,
        description: data.description,
        salaryIncome: data.salaryIncome,
        rentalIncome: data.rentalIncome,
        dividendIncome: data.dividendIncome,
        otherIncome: data.otherIncome,
      },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Declaración patrimonial agregada correctamente',
      success: true,
      data: assetDeclaration,
    };
  }

  async updateAssetDeclaration(id: number, data: any): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.assetDeclaration.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Declaración patrimonial no encontrada',
        success: false,
        data: null,
      });
    }

    const assetDeclaration = await this.prisma.assetDeclaration.update({
      where: { id },
      data,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Declaración patrimonial actualizada correctamente',
      success: true,
      data: assetDeclaration,
    };
  }

  async deleteAssetDeclaration(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.assetDeclaration.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Declaración patrimonial no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.assetDeclaration.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Declaración patrimonial eliminada correctamente',
      success: true,
      data: existing,
    };
  }

  // =====================
  // INVESTIGATIONS
  // =====================

  async addInvestigation(candidateId: number, data: any): Promise<ServiceResponse<any>> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Candidato no encontrado',
        success: false,
        data: null,
      });
    }

    const investigation = await this.prisma.investigation.create({
      data: {
        candidateId,
        type: data.type,
        description: data.description,
        institution: data.institution,
        status: data.status,
        filingDate: data.filingDate ? new Date(data.filingDate) : null,
        resolutionDate: data.resolutionDate ? new Date(data.resolutionDate) : null,
        outcome: data.outcome,
        sourceUrl: data.sourceUrl,
      },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Investigación agregada correctamente',
      success: true,
      data: investigation,
    };
  }

  async updateInvestigation(id: number, data: any): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.investigation.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Investigación no encontrada',
        success: false,
        data: null,
      });
    }

    const updateData: any = { ...data };
    if (data.filingDate) updateData.filingDate = new Date(data.filingDate);
    if (data.resolutionDate) updateData.resolutionDate = new Date(data.resolutionDate);

    const investigation = await this.prisma.investigation.update({
      where: { id },
      data: updateData,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Investigación actualizada correctamente',
      success: true,
      data: investigation,
    };
  }

  async deleteInvestigation(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.investigation.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Investigación no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.investigation.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Investigación eliminada correctamente',
      success: true,
      data: existing,
    };
  }
}
