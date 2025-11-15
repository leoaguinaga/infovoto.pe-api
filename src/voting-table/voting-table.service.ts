import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVotingTableDto } from './dto/create-voting-table.dto';
import { UpdateVotingTableDto } from './dto/update-voting-table.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class VotingTableService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly baseInclude = {
    votingCenter: true,
    voters: {
      select: {
        id: true,
        documentNumber: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    },
    members: {
      select: {
        id: true,
        roleInTable: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    },
  };

  async create(
    createVotingTableDto: CreateVotingTableDto,
  ): Promise<ServiceResponse<any>> {
    const { code, votingCenterId, room, floor } = createVotingTableDto;

    // Validar unicidad de código
    const existingByCode = await this.prisma.votingTable.findUnique({
      where: { code },
    });

    if (existingByCode) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Ya existe una mesa con ese código',
        success: false,
        data: null,
      });
    }

    // Validar que el local exista
    const center = await this.prisma.votingCenter.findUnique({
      where: { id: votingCenterId },
    });

    if (!center) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Local de votación no encontrado',
        success: false,
        data: null,
      });
    }

    const table = await this.prisma.votingTable.create({
      data: {
        code,
        votingCenterId,
        room,
        floor,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Mesa de votación creada correctamente',
      success: true,
      data: table,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const tables = await this.prisma.votingTable.findMany({
      include: this.baseInclude,
      orderBy: [
        { votingCenterId: 'asc' },
        { code: 'asc' },
      ],
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de mesas de votación obtenido correctamente',
      success: true,
      data: tables,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const table = await this.prisma.votingTable.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!table) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Mesa de votación no encontrada',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Mesa de votación obtenida correctamente',
      success: true,
      data: table,
    };
  }

  async update(
    id: number,
    updateVotingTableDto: UpdateVotingTableDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.votingTable.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Mesa de votación no encontrada',
        success: false,
        data: null,
      });
    }

    const data: any = {
      code: updateVotingTableDto.code,
      room: updateVotingTableDto.room,
      floor: updateVotingTableDto.floor,
    };

    // Validar cambio de código (unicidad)
    if (
      updateVotingTableDto.code &&
      updateVotingTableDto.code !== existing.code
    ) {
      const existingByCode = await this.prisma.votingTable.findUnique({
        where: { code: updateVotingTableDto.code },
      });

      if (existingByCode && existingByCode.id !== id) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'Ya existe otra mesa con ese código',
          success: false,
          data: null,
        });
      }
    }

    // Cambio de local de votación
    if (updateVotingTableDto.votingCenterId !== undefined) {
      const center = await this.prisma.votingCenter.findUnique({
        where: { id: updateVotingTableDto.votingCenterId },
      });

      if (!center) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Local de votación no encontrado',
          success: false,
          data: null,
        });
      }

      data.votingCenterId = updateVotingTableDto.votingCenterId;
    }

    // limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const table = await this.prisma.votingTable.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Mesa de votación actualizada correctamente',
      success: true,
      data: table,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.votingTable.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Mesa de votación no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.votingTable.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Mesa de votación eliminada correctamente',
      success: true,
      data: existing,
    };
  }
}
