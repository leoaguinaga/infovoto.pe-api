// src/table-member/table-member.service.ts
import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTableMemberDto } from './dto/create-table-member.dto';
import { UpdateTableMemberDto } from './dto/update-table-member.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import { UserRole } from 'generated/prisma/client';

@Injectable()
export class TableMemberService {
  constructor(private readonly prisma: PrismaService) {}

  // Siempre que devolvamos un TableMember, traemos info útil asociada
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

  async create(
    createTableMemberDto: CreateTableMemberDto,
  ): Promise<ServiceResponse<any>> {
    const { userId, votingTableId, roleInTable } = createTableMemberDto;

    // 1. Validar que el usuario exista
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado para crear el miembro de mesa',
        success: false,
        data: null,
      });
    }

    // 2. Validar que el usuario no tenga ya un registro de TableMember
    const existingByUser = await this.prisma.tableMember.findUnique({
      where: { userId },
    });

    if (existingByUser) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'El usuario ya está registrado como miembro de mesa',
        success: false,
        data: null,
      });
    }

    // 3. Validar que la mesa exista
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

    // 4. (Opcional pero útil) Si el usuario no tiene rol TABLE_MEMBER, lo actualizamos
    if (user.role !== UserRole.TABLE_MEMBER) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.TABLE_MEMBER },
      });
    }

    const tableMember = await this.prisma.tableMember.create({
      data: {
        userId,
        votingTableId,
        roleInTable,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Miembro de mesa creado correctamente',
      success: true,
      data: tableMember,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const members = await this.prisma.tableMember.findMany({
      include: this.baseInclude,
      orderBy: { id: 'asc' },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de miembros de mesa obtenido correctamente',
      success: true,
      data: members,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const member = await this.prisma.tableMember.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!member) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Miembro de mesa no encontrado',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Miembro de mesa obtenido correctamente',
      success: true,
      data: member,
    };
  }

  async update(
    id: number,
    updateTableMemberDto: UpdateTableMemberDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.tableMember.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Miembro de mesa no encontrado',
        success: false,
        data: null,
      });
    }

    const data: any = {};

    // Cambiar de mesa (si se envía)
    if (updateTableMemberDto.votingTableId !== undefined) {
      const table = await this.prisma.votingTable.findUnique({
        where: { id: updateTableMemberDto.votingTableId },
      });

      if (!table) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'La mesa de votación especificada no existe',
          success: false,
          data: null,
        });
      }

      data.votingTableId = updateTableMemberDto.votingTableId;
    }

    // Cambiar rol dentro de la mesa
    if (updateTableMemberDto.roleInTable !== undefined) {
      data.roleInTable = updateTableMemberDto.roleInTable;
    }

    // Limpieza de undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const updated = await this.prisma.tableMember.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Miembro de mesa actualizado correctamente',
      success: true,
      data: updated,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.tableMember.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Miembro de mesa no encontrado',
        success: false,
        data: null,
      });
    }

    await this.prisma.tableMember.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Miembro de mesa eliminado correctamente',
      success: true,
      data: existing,
    };
  }
}
