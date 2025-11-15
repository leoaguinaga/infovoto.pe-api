import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGovernmentPlanDto } from './dto/create-government-plan.dto';
import { UpdateGovernmentPlanDto } from './dto/update-government-plan.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class GovernmentPlanService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly baseInclude = {
    politicalGroup: {
      select: {
        id: true,
        name: true,
        shortName: true,
        logoUrl: true,
      },
    },
    sections: {
      select: {
        id: true,
        sector: true,
        title: true,
        order: true,
      },
      orderBy: { order: 'asc' as const },
    },
  };

  async create(
    createDto: CreateGovernmentPlanDto,
  ): Promise<ServiceResponse<any>> {
    const {
      politicalGroupId,
      title,
      description,
      documentUrl,
      fromYear,
      toYear,
    } = createDto;

    // Validar que el PoliticalGroup exista
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

    const plan = await this.prisma.governmentPlan.create({
      data: {
        politicalGroupId,
        title,
        description,
        documentUrl,
        fromYear,
        toYear,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Plan de gobierno creado correctamente',
      success: true,
      data: plan,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const plans = await this.prisma.governmentPlan.findMany({
      include: this.baseInclude,
      orderBy: [
        { politicalGroupId: 'asc' },
        { fromYear: 'asc' },
        { id: 'asc' },
      ],
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de planes de gobierno obtenido correctamente',
      success: true,
      data: plans,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const plan = await this.prisma.governmentPlan.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!plan) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Plan de gobierno no encontrado',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Plan de gobierno obtenido correctamente',
      success: true,
      data: plan,
    };
  }

  async update(
    id: number,
    updateDto: UpdateGovernmentPlanDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.governmentPlan.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Plan de gobierno no encontrado',
        success: false,
        data: null,
      });
    }

    const data: any = {
      title: updateDto.title,
      description: updateDto.description,
      documentUrl: updateDto.documentUrl,
      fromYear: updateDto.fromYear,
      toYear: updateDto.toYear,
    };

    // Si cambia el politicalGroupId, validar
    if (updateDto.politicalGroupId !== undefined) {
      const group = await this.prisma.politicalGroup.findUnique({
        where: { id: updateDto.politicalGroupId },
      });

      if (!group) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Agrupación política asociada no encontrada',
          success: false,
          data: null,
        });
      }

      data.politicalGroupId = updateDto.politicalGroupId;
    }

    // Limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const plan = await this.prisma.governmentPlan.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Plan de gobierno actualizado correctamente',
      success: true,
      data: plan,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.governmentPlan.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Plan de gobierno no encontrado',
        success: false,
        data: null,
      });
    }

    await this.prisma.governmentPlan.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Plan de gobierno eliminado correctamente',
      success: true,
      data: existing,
    };
  }
}
