import {
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class CommentService {
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
    post: {
      select: {
        id: true,
        title: true,
        candidateId: true,
      },
    },
    parent: {
      select: {
        id: true,
        content: true,
        author: {
          select: { id: true, name: true },
        },
      },
    },
    replies: {
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: { id: true, name: true },
        },
      },
    },
  };

  async create(
    createCommentDto: CreateCommentDto,
  ): Promise<ServiceResponse<any>> {
    const { postId, authorId, content, parentId } = createCommentDto;

    // Validar post
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Post no encontrado para asociar el comentario',
        success: false,
        data: null,
      });
    }

    // Validar autor
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!author) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Autor del comentario no encontrado',
        success: false,
        data: null,
      });
    }

    // Validar parentId (si viene)
    if (parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Comentario padre no encontrado',
          success: false,
          data: null,
        });
      }

      // Opcional: asegurar que el padre pertenece al mismo post
      if (parentComment.postId !== postId) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'El comentario padre debe pertenecer al mismo post',
          success: false,
          data: null,
        });
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        postId,
        authorId,
        content,
        parentId,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Comentario creado correctamente',
      success: true,
      data: comment,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const comments = await this.prisma.comment.findMany({
      include: this.baseInclude,
      orderBy: { createdAt: 'desc' },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de comentarios obtenido correctamente',
      success: true,
      data: comments,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!comment) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Comentario no encontrado',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Comentario obtenido correctamente',
      success: true,
      data: comment,
    };
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Comentario no encontrado',
        success: false,
        data: null,
      });
    }

    const data: any = {
      content: updateCommentDto.content,
    };

    // Manejo de cambio de parentId
    if (updateCommentDto.parentId !== undefined) {
      const newParentId = updateCommentDto.parentId;

      if (newParentId === null) {
        data.parentId = null;
      } else {
        if (newParentId === id) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message:
              'Un comentario no puede ser padre de sí mismo',
            success: false,
            data: null,
          });
        }

        const parentComment = await this.prisma.comment.findUnique({
          where: { id: newParentId },
        });

        if (!parentComment) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Comentario padre no encontrado',
            success: false,
            data: null,
          });
        }

        if (parentComment.postId !== existing.postId) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message:
              'El comentario padre debe pertenecer al mismo post',
            success: false,
            data: null,
          });
        }

        data.parentId = newParentId;
      }
    }

    // Limpiar undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    const comment = await this.prisma.comment.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Comentario actualizado correctamente',
      success: true,
      data: comment,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.comment.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Comentario no encontrado',
        success: false,
        data: null,
      });
    }

    // OJO: si tu base no tiene ON DELETE CASCADE en replies,
    // borrar un comentario con respuestas puede lanzar error de FK.
    await this.prisma.comment.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Comentario eliminado correctamente',
      success: true,
      data: existing,
    };
  }
}
