import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateElectoralEventDto } from './dto/create-electoral-event.dto';
  import { UpdateElectoralEventDto } from './dto/update-electoral-event.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class ElectoralEventService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly baseInclude = {
    election: {
      select: {
        id: true,
        name: true,
        type: true,
        date: true,
      },
    },
  };

  async create(
    createElectoralEventDto: CreateElectoralEventDto,
  ): Promise<ServiceResponse<any>> {
    const { electionId, name, description, date, category, isPublished } =
      createElectoralEventDto;

    // Validar que exista la elección
    const election = await this.prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Elección asociada no encontrada',
        success: false,
        data: null,
      });
    }

    const event = await this.prisma.electoralEvent.create({
      data: {
        electionId,
        name,
        description,
        date: new Date(date),
        category,
        isPublished: isPublished ?? true,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Evento electoral creado correctamente',
      success: true,
      data: event,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const events = await this.prisma.electoralEvent.findMany({
      include: this.baseInclude,
      orderBy: { date: 'asc' },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de eventos electorales obtenido correctamente',
      success: true,
      data: events,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const event = await this.prisma.electoralEvent.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!event) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Evento electoral no encontrado',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Evento electoral obtenido correctamente',
      success: true,
      data: event,
    };
  }

  async update(
    id: number,
    updateElectoralEventDto: UpdateElectoralEventDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.electoralEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Evento electoral no encontrado',
        success: false,
        data: null,
      });
    }

    const data: any = {
      name: updateElectoralEventDto.name,
      description: updateElectoralEventDto.description,
      category: updateElectoralEventDto.category,
      isPublished: updateElectoralEventDto.isPublished,
    };

    if (updateElectoralEventDto.date) {
      data.date = new Date(updateElectoralEventDto.date);
    }

    if (updateElectoralEventDto.electionId !== undefined) {
      const election = await this.prisma.election.findUnique({
        where: { id: updateElectoralEventDto.electionId },
      });

      if (!election) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Elección asociada no encontrada',
          success: false,
          data: null,
        });
      }

      data.electionId = updateElectoralEventDto.electionId;
    }

    // limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const event = await this.prisma.electoralEvent.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Evento electoral actualizado correctamente',
      success: true,
      data: event,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.electoralEvent.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Evento electoral no encontrado',
        success: false,
        data: null,
      });
    }

    await this.prisma.electoralEvent.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Evento electoral eliminado correctamente',
      success: true,
      data: existing,
    };
  }
}
