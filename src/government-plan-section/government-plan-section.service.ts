import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGovernmentPlanSectionDto } from './dto/create-government-plan-section.dto';
import { UpdateGovernmentPlanSectionDto } from './dto/update-government-plan-section.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class GovernmentPlanSectionService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly baseInclude = {
    governmentPlan: {
      select: {
        id: true,
        title: true,
        politicalGroup: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logoUrl: true,
          },
        },
      },
    },
  };

  async create(
    createDto: CreateGovernmentPlanSectionDto,
  ): Promise<ServiceResponse<any>> {
    const { governmentPlanId, sector, title, content, order } =
      createDto;

    // Validar que el GovernmentPlan exista
    const plan = await this.prisma.governmentPlan.findUnique({
      where: { id: governmentPlanId },
    });

    if (!plan) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Plan de gobierno no encontrado',
        success: false,
        data: null,
      });
    }

    const section = await this.prisma.governmentPlanSection.create({
      data: {
        governmentPlanId,
        sector,
        title,
        content,
        order,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Sección del plan de gobierno creada correctamente',
      success: true,
      data: section,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const sections = await this.prisma.governmentPlanSection.findMany({
      include: this.baseInclude,
      orderBy: [
        { governmentPlanId: 'asc' },
        { order: 'asc' },
        { id: 'asc' },
      ],
    });

    return {
      statusCode: HttpStatus.OK,
      message:
        'Listado de secciones de planes de gobierno obtenido correctamente',
      success: true,
      data: sections,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const section = await this.prisma.governmentPlanSection.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!section) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Sección de plan de gobierno no encontrada',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Sección de plan de gobierno obtenida correctamente',
      success: true,
      data: section,
    };
  }

  async update(
    id: number,
    updateDto: UpdateGovernmentPlanSectionDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.governmentPlanSection.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Sección de plan de gobierno no encontrada',
        success: false,
        data: null,
      });
    }

    const data: any = {
      sector: updateDto.sector,
      title: updateDto.title,
      content: updateDto.content,
      order: updateDto.order,
    };

    // Si cambia el governmentPlanId, validar que exista
    if (updateDto.governmentPlanId !== undefined) {
      const plan = await this.prisma.governmentPlan.findUnique({
        where: { id: updateDto.governmentPlanId },
      });

      if (!plan) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Plan de gobierno asociado no encontrado',
          success: false,
          data: null,
        });
      }

      data.governmentPlanId = updateDto.governmentPlanId;
    }

    // Limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const section = await this.prisma.governmentPlanSection.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Sección de plan de gobierno actualizada correctamente',
      success: true,
      data: section,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.governmentPlanSection.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Sección de plan de gobierno no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.governmentPlanSection.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Sección de plan de gobierno eliminada correctamente',
      success: true,
      data: existing,
    };
  }
}
