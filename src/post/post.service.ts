import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly baseInclude = {
    author: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
    candidate: {
      select: {
        id: true,
        fullName: true,
        office: true,
        politicalGroup: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logoUrl: true,
          },
        },
      },
    },
    // Puedes comentar estas relaciones si no quieres sobrecargar la respuesta
    comments: true,
    moderationAlerts: true,
  };

  async create(createPostDto: CreatePostDto): Promise<ServiceResponse<any>> {
    const { title, content, status, authorId, candidateId } = createPostDto;

    // Validar que el autor exista
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Autor del post no encontrado',
        success: false,
        data: null,
      });
    }

    // Validar que el candidato exista (si se envía candidateId)
    if (candidateId) {
      const candidate = await this.prisma.candidate.findUnique({
        where: { id: candidateId },
      });

      if (!candidate) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Candidato asociado al post no encontrado',
          success: false,
          data: null,
        });
      }
    }

    const post = await this.prisma.post.create({
      data: {
        title,
        content,
        status, // si viene undefined, Prisma pondrá el default PUBLISHED
        authorId,
        candidateId,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Post creado correctamente',
      success: true,
      data: post,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const posts = await this.prisma.post.findMany({
      include: this.baseInclude,
      orderBy: { createdAt: 'desc' },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de posts obtenido correctamente',
      success: true,
      data: posts,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!post) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Post no encontrado',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Post obtenido correctamente',
      success: true,
      data: post,
    };
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Post no encontrado',
        success: false,
        data: null,
      });
    }

    const data: any = {
      title: updatePostDto.title,
      content: updatePostDto.content,
      status: updatePostDto.status,
    };

    // Si viene candidateId, validar candidato
    if (updatePostDto.candidateId !== undefined) {
      if (updatePostDto.candidateId === null) {
        data.candidateId = null;
      } else {
        const candidate = await this.prisma.candidate.findUnique({
          where: { id: updatePostDto.candidateId },
        });

        if (!candidate) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Candidato asociado al post no encontrado',
            success: false,
            data: null,
          });
        }

        data.candidateId = updatePostDto.candidateId;
      }
    }

    // Limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const post = await this.prisma.post.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Post actualizado correctamente',
      success: true,
      data: post,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.post.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Post no encontrado',
        success: false,
        data: null,
      });
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Post eliminado correctamente',
      success: true,
      data: existing,
    };
  }
}
