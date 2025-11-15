import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostModerationAlertDto } from './dto/create-post-moderation-alert.dto';
import { UpdatePostModerationAlertDto } from './dto/update-post-moderation-alert.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';
import { ModerationStatus } from '@prisma/client';

@Injectable()
export class PostModerationAlertService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly baseInclude = {
    post: {
      select: {
        id: true,
        title: true,
        status: true,
        candidateId: true,
      },
    },
    reviewedByAdmin: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
  };

  async create(
    createDto: CreatePostModerationAlertDto,
  ): Promise<ServiceResponse<any>> {
    const { postId, aiSummary, status } = createDto;

    // Validar que el post exista
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Post no encontrado para crear la alerta de moderación',
        success: false,
        data: null,
      });
    }

    const alert = await this.prisma.postModerationAlert.create({
      data: {
        postId,
        aiSummary,
        status: status ?? ModerationStatus.PENDING,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Alerta de moderación creada correctamente',
      success: true,
      data: alert,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const alerts = await this.prisma.postModerationAlert.findMany({
      include: this.baseInclude,
      orderBy: { createdAt: 'desc' },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de alertas de moderación obtenido correctamente',
      success: true,
      data: alerts,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const alert = await this.prisma.postModerationAlert.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!alert) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Alerta de moderación no encontrada',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Alerta de moderación obtenida correctamente',
      success: true,
      data: alert,
    };
  }

  async update(
    id: number,
    updateDto: UpdatePostModerationAlertDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.postModerationAlert.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Alerta de moderación no encontrada',
        success: false,
        data: null,
      });
    }

    const data: any = {
      aiSummary: updateDto.aiSummary,
      status: updateDto.status,
    };

    // Validar admin si viene reviewedByAdminId
    if (updateDto.reviewedByAdminId !== undefined) {
      if (updateDto.reviewedByAdminId === null) {
        data.reviewedByAdminId = null;
      } else {
        const admin = await this.prisma.user.findUnique({
          where: { id: updateDto.reviewedByAdminId },
        });

        if (!admin) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message:
              'Usuario administrador que revisa la alerta no encontrado',
            success: false,
            data: null,
          });
        }

        data.reviewedByAdminId = updateDto.reviewedByAdminId;
      }
    }

    // Manejo de reviewedAt
    if (updateDto.reviewedAt) {
      data.reviewedAt = new Date(updateDto.reviewedAt);
    } else if (
      updateDto.status &&
      updateDto.status !== ModerationStatus.PENDING &&
      !existing.reviewedAt
    ) {
      // Si se cambia el estado a APPROVED o REJECTED y no se envía fecha,
      // se registra la fecha/hora actual.
      data.reviewedAt = new Date();
    }

    // Limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const alert = await this.prisma.postModerationAlert.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Alerta de moderación actualizada correctamente',
      success: true,
      data: alert,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.postModerationAlert.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Alerta de moderación no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.postModerationAlert.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Alerta de moderación eliminada correctamente',
      success: true,
      data: existing,
    };
  }
}
