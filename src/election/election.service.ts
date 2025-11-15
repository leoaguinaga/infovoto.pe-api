import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class ElectionService {
  constructor(private readonly prisma: PrismaService) {}

  // Qué traemos siempre cuando devolvemos una elección
  private readonly baseInclude = {
    events: true,
    news: true,
    guides: true,
  };

  async create(
    createElectionDto: CreateElectionDto,
  ): Promise<ServiceResponse<any>> {
    const { name, description, type, date } = createElectionDto;

    const election = await this.prisma.election.create({
      data: {
        name,
        description,
        type,
        date: new Date(date),
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Elección creada correctamente',
      success: true,
      data: election,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const elections = await this.prisma.election.findMany({
      include: this.baseInclude,
      orderBy: { date: 'asc' },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de elecciones obtenido correctamente',
      success: true,
      data: elections,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const election = await this.prisma.election.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!election) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Elección no encontrada',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Elección obtenida correctamente',
      success: true,
      data: election,
    };
  }

  async update(
    id: number,
    updateElectionDto: UpdateElectionDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.election.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Elección no encontrada',
        success: false,
        data: null,
      });
    }

    const data: any = {
      name: updateElectionDto.name,
      description: updateElectionDto.description,
      type: updateElectionDto.type,
    };

    if (updateElectionDto.date) {
      data.date = new Date(updateElectionDto.date);
    }

    // limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const election = await this.prisma.election.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Elección actualizada correctamente',
      success: true,
      data: election,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.election.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Elección no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.election.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Elección eliminada correctamente',
      success: true,
      data: existing,
    };
  }
}
