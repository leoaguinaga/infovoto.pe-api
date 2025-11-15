import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGuideContentDto } from './dto/create-guide-content.dto';
import { UpdateGuideContentDto } from './dto/update-guide-content.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class GuideContentService {
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
    createGuideContentDto: CreateGuideContentDto,
  ): Promise<ServiceResponse<any>> {
    const { title, content, category, electionId } =
      createGuideContentDto;

    if (electionId) {
      const election = await this.prisma.election.findUnique({
        where: { id: electionId },
      });

      if (!election) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Elección asociada a la guía no encontrada',
          success: false,
          data: null,
        });
      }
    }

    const guide = await this.prisma.guideContent.create({
      data: {
        title,
        content,
        category,
        electionId,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Contenido informativo creado correctamente',
      success: true,
      data: guide,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const guides = await this.prisma.guideContent.findMany({
      include: this.baseInclude,
      orderBy: {
        id: 'asc',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message:
        'Listado de contenidos informativos obtenido correctamente',
      success: true,
      data: guides,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const guide = await this.prisma.guideContent.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!guide) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Contenido informativo no encontrado',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Contenido informativo obtenido correctamente',
      success: true,
      data: guide,
    };
  }

  async update(
    id: number,
    updateGuideContentDto: UpdateGuideContentDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.guideContent.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Contenido informativo no encontrado',
        success: false,
        data: null,
      });
    }

    const data: any = {
      title: updateGuideContentDto.title,
      content: updateGuideContentDto.content,
      category: updateGuideContentDto.category,
    };

    if (updateGuideContentDto.electionId !== undefined) {
      if (updateGuideContentDto.electionId === null) {
        data.electionId = null;
      } else {
        const election = await this.prisma.election.findUnique({
          where: { id: updateGuideContentDto.electionId },
        });

        if (!election) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Elección asociada a la guía no encontrada',
            success: false,
            data: null,
          });
        }

        data.electionId = updateGuideContentDto.electionId;
      }
    }

    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const guide = await this.prisma.guideContent.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Contenido informativo actualizado correctamente',
      success: true,
      data: guide,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.guideContent.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Contenido informativo no encontrado',
        success: false,
        data: null,
      });
    }

    await this.prisma.guideContent.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Contenido informativo eliminado correctamente',
      success: true,
      data: existing,
    };
  }
}
