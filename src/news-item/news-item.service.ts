import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsItemDto } from './dto/create-news-item.dto';
import { UpdateNewsItemDto } from './dto/update-news-item.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class NewsItemService {
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
    politicalGroup: {
      select: {
        id: true,
        name: true,
        shortName: true,
        logoUrl: true,
      },
    },
  };

  async create(
    createNewsItemDto: CreateNewsItemDto,
  ): Promise<ServiceResponse<any>> {
    const {
      title,
      summary,
      content,
      source,
      sourceUrl,
      publishedAt,
      electionId,
      politicalGroupId,
    } = createNewsItemDto;

    if (electionId) {
      const election = await this.prisma.election.findUnique({
        where: { id: electionId },
      });

      if (!election) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Elección asociada a la noticia no encontrada',
          success: false,
          data: null,
        });
      }
    }

    if (politicalGroupId) {
      const group = await this.prisma.politicalGroup.findUnique({
        where: { id: politicalGroupId },
      });

      if (!group) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message:
            'Agrupación política asociada a la noticia no encontrada',
          success: false,
          data: null,
        });
      }
    }

    const newsItem = await this.prisma.newsItem.create({
      data: {
        title,
        summary,
        content,
        source,
        sourceUrl,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        electionId,
        politicalGroupId,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Noticia creada correctamente',
      success: true,
      data: newsItem,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const news = await this.prisma.newsItem.findMany({
      include: this.baseInclude,
      orderBy: [
        { publishedAt: 'desc' },
        { id: 'desc' },
      ],
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de noticias obtenido correctamente',
      success: true,
      data: news,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const newsItem = await this.prisma.newsItem.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!newsItem) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Noticia no encontrada',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Noticia obtenida correctamente',
      success: true,
      data: newsItem,
    };
  }

  async update(
    id: number,
    updateNewsItemDto: UpdateNewsItemDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.newsItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Noticia no encontrada',
        success: false,
        data: null,
      });
    }

    const data: any = {
      title: updateNewsItemDto.title,
      summary: updateNewsItemDto.summary,
      content: updateNewsItemDto.content,
      source: updateNewsItemDto.source,
      sourceUrl: updateNewsItemDto.sourceUrl,
    };

    if (updateNewsItemDto.publishedAt !== undefined) {
      data.publishedAt = updateNewsItemDto.publishedAt
        ? new Date(updateNewsItemDto.publishedAt)
        : null;
    }

    // Manejo de electionId
    if (updateNewsItemDto.electionId !== undefined) {
      if (updateNewsItemDto.electionId === null) {
        data.electionId = null;
      } else {
        const election = await this.prisma.election.findUnique({
          where: { id: updateNewsItemDto.electionId },
        });

        if (!election) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Elección asociada a la noticia no encontrada',
            success: false,
            data: null,
          });
        }

        data.electionId = updateNewsItemDto.electionId;
      }
    }

    // Manejo de politicalGroupId
    if (updateNewsItemDto.politicalGroupId !== undefined) {
      if (updateNewsItemDto.politicalGroupId === null) {
        data.politicalGroupId = null;
      } else {
        const group = await this.prisma.politicalGroup.findUnique({
          where: { id: updateNewsItemDto.politicalGroupId },
        });

        if (!group) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message:
              'Agrupación política asociada a la noticia no encontrada',
            success: false,
            data: null,
          });
        }

        data.politicalGroupId = updateNewsItemDto.politicalGroupId;
      }
    }

    // limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const newsItem = await this.prisma.newsItem.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Noticia actualizada correctamente',
      success: true,
      data: newsItem,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.newsItem.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Noticia no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.newsItem.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Noticia eliminada correctamente',
      success: true,
      data: existing,
    };
  }
}
