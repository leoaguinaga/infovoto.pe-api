// src/political-group/political-group.service.ts
import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePoliticalGroupDto } from './dto/create-political-group.dto';
import { UpdatePoliticalGroupDto } from './dto/update-political-group.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class PoliticalGroupService {
  constructor(private readonly prisma: PrismaService) {}

  // Siempre que devolvamos un PoliticalGroup, incluimos relaciones útiles
  private readonly baseInclude = {
    governmentPlans: true,
    candidates: true,
    news: true,
  };

  async create(
    createPoliticalGroupDto: CreatePoliticalGroupDto,
  ): Promise<ServiceResponse<any>> {
    const { name, shortName, logoUrl, description } = createPoliticalGroupDto;

    const politicalGroup = await this.prisma.politicalGroup.create({
      data: {
        name,
        shortName,
        logoUrl,
        description,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Agrupación política creada correctamente',
      success: true,
      data: politicalGroup,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const groups = await this.prisma.politicalGroup.findMany({
      include: {
        ...this.baseInclude,
        candidates: {
          include: {
            voteIntentions: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de agrupaciones políticas obtenido correctamente',
      success: true,
      data: groups,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const group = await this.prisma.politicalGroup.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!group) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Agrupación política no encontrada',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Agrupación política obtenida correctamente',
      success: true,
      data: group,
    };
  }

  async update(
    id: number,
    updatePoliticalGroupDto: UpdatePoliticalGroupDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.politicalGroup.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Agrupación política no encontrada',
        success: false,
        data: null,
      });
    }

    const data: any = {
      name: updatePoliticalGroupDto.name,
      shortName: updatePoliticalGroupDto.shortName,
      logoUrl: updatePoliticalGroupDto.logoUrl,
      description: updatePoliticalGroupDto.description,
    };

    // limpiar undefined para no sobreescribir
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const group = await this.prisma.politicalGroup.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Agrupación política actualizada correctamente',
      success: true,
      data: group,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.politicalGroup.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Agrupación política no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.politicalGroup.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Agrupación política eliminada correctamente',
      success: true,
      data: existing,
    };
  }
}
