import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVotingCenterDto } from './dto/create-voting-center.dto';
import { UpdateVotingCenterDto } from './dto/update-voting-center.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class VotingCenterService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly baseInclude = {
    votingTables: true,
  };

  async create(
    createVotingCenterDto: CreateVotingCenterDto,
  ): Promise<ServiceResponse<any>> {
    const {
      name,
      address,
      latitude,
      longitude,
      department,
      province,
      district,
    } = createVotingCenterDto;

    const center = await this.prisma.votingCenter.create({
      data: {
        name,
        address,
        latitude,
        longitude,
        department,
        province,
        district,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Local de votación creado correctamente',
      success: true,
      data: center,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const centers = await this.prisma.votingCenter.findMany({
      include: this.baseInclude,
      orderBy: {
        name: 'asc',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de locales de votación obtenido correctamente',
      success: true,
      data: centers,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const center = await this.prisma.votingCenter.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!center) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Local de votación no encontrado',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Local de votación obtenido correctamente',
      success: true,
      data: center,
    };
  }

  async update(
    id: number,
    updateVotingCenterDto: UpdateVotingCenterDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.votingCenter.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Local de votación no encontrado',
        success: false,
        data: null,
      });
    }

    const data: any = {
      name: updateVotingCenterDto.name,
      address: updateVotingCenterDto.address,
      latitude: updateVotingCenterDto.latitude,
      longitude: updateVotingCenterDto.longitude,
      department: updateVotingCenterDto.department,
      province: updateVotingCenterDto.province,
      district: updateVotingCenterDto.district,
      sketchUrl: updateVotingCenterDto.sketchUrl,
    };

    // limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const center = await this.prisma.votingCenter.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Local de votación actualizado correctamente',
      success: true,
      data: center,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.votingCenter.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Local de votación no encontrado',
        success: false,
        data: null,
      });
    }

    await this.prisma.votingCenter.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Local de votación eliminado correctamente',
      success: true,
      data: existing,
    };
  }
}
