import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { PreRegisterVoterDto } from './dto/pre-register-voter.dto';
import { UpdateVoterDto } from './dto/update-voter.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import { UserRole } from '@prisma/client';

@Injectable()
export class VoterService {
  constructor(private readonly prisma: PrismaService) {}

  // Para incluir siempre la info útil asociada
  private readonly baseInclude = {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
    votingTable: {
      include: {
        votingCenter: true,
      },
    },
  };

  async create(createVoterDto: CreateVoterDto): Promise<ServiceResponse<any>> {
    const { userId, documentNumber, votingTableId } = createVoterDto;

    // Validar que el usuario exista
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado para crear el perfil de votante',
        success: false,
        data: null,
      });
    }

    // Validar que el usuario no tenga ya perfil de votante
    const existingVoterByUser = await this.prisma.voter.findUnique({
      where: { userId },
    });

    if (existingVoterByUser) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'El usuario ya tiene un perfil de votante',
        success: false,
        data: null,
      });
    }

    // Validar que el documento no esté repetido
    const existingVoterByDoc = await this.prisma.voter.findUnique({
      where: { documentNumber },
    });

    if (existingVoterByDoc) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'El documento de identidad ya está registrado en otro votante',
        success: false,
        data: null,
      });
    }

    // Validar que la mesa de votación exista (si se envía)
    if (votingTableId) {
      const table = await this.prisma.votingTable.findUnique({
        where: { id: votingTableId },
      });

      if (!table) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'La mesa de votación especificada no existe',
          success: false,
          data: null,
        });
      }
    }

    const voter = await this.prisma.voter.create({
      data: {
        userId,
        documentNumber,
        votingTableId,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Votante creado correctamente',
      success: true,
      data: voter,
    };
  }

  /**
   * Pre-registrar votante con DNI
   * Crea un usuario inactivo y su perfil de votante
   */
  async preRegister(preRegisterVoterDto: PreRegisterVoterDto): Promise<ServiceResponse<any>> {
    const { name, documentNumber, votingTableId } = preRegisterVoterDto;

    // Validar que el documento no esté repetido
    const existingVoterByDoc = await this.prisma.voter.findUnique({
      where: { documentNumber },
    });

    if (existingVoterByDoc) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'El documento de identidad ya está registrado',
        success: false,
        data: null,
      });
    }

    // Validar que la mesa de votación exista (si se envía)
    if (votingTableId) {
      const table = await this.prisma.votingTable.findUnique({
        where: { id: votingTableId },
      });

      if (!table) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'La mesa de votación especificada no existe',
          success: false,
          data: null,
        });
      }
    }

    // Crear usuario inactivo sin email ni contraseña
    const user = await this.prisma.user.create({
      data: {
        name,
        role: UserRole.VOTER,
        isActive: false,
      },
    });

    // Crear perfil de votante asociado
    const voter = await this.prisma.voter.create({
      data: {
        userId: user.id,
        documentNumber,
        votingTableId,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Votante pre-registrado correctamente. Debe activar su cuenta con email.',
      success: true,
      data: voter,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const voters = await this.prisma.voter.findMany({
      include: this.baseInclude,
      orderBy: { id: 'asc' },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de votantes obtenido correctamente',
      success: true,
      data: voters,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const voter = await this.prisma.voter.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!voter) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Votante no encontrado',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Votante obtenido correctamente',
      success: true,
      data: voter,
    };
  }

  async update(
    id: number,
    updateVoterDto: UpdateVoterDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.voter.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Votante no encontrado',
        success: false,
        data: null,
      });
    }

    const data: any = {};

    if (updateVoterDto.documentNumber) {
      // Verificar que el nuevo documento no esté usado por otro votante
      const existingByDoc = await this.prisma.voter.findUnique({
        where: { documentNumber: updateVoterDto.documentNumber },
      });

      if (existingByDoc && existingByDoc.id !== id) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'El documento de identidad ya está registrado en otro votante',
          success: false,
          data: null,
        });
      }

      data.documentNumber = updateVoterDto.documentNumber;
    }

    if (updateVoterDto.votingTableId !== undefined) {
      if (updateVoterDto.votingTableId === null) {
        data.votingTableId = null;
      } else {
        const table = await this.prisma.votingTable.findUnique({
          where: { id: updateVoterDto.votingTableId },
        });

        if (!table) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'La mesa de votación especificada no existe',
            success: false,
            data: null,
          });
        }

        data.votingTableId = updateVoterDto.votingTableId;
      }
    }

    // Limpieza de undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const voter = await this.prisma.voter.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Votante actualizado correctamente',
      success: true,
      data: voter,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.voter.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Votante no encontrado',
        success: false,
        data: null,
      });
    }

    await this.prisma.voter.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Votante eliminado correctamente',
      success: true,
      data: existing,
    };
  }
}
