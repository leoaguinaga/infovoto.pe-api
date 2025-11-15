import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoteIntentionDto } from './dto/create-vote-intention.dto';
import { UpdateVoteIntentionDto } from './dto/update-vote-intention.dto';
import { ServiceResponse } from 'src/interfaces/serviceResponse';

@Injectable()
export class VoteIntentionService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly baseInclude = {
    user: {
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
    createVoteIntentionDto: CreateVoteIntentionDto,
  ): Promise<ServiceResponse<any>> {
    const { userId, candidateId, electionId } = createVoteIntentionDto;

    // Validar usuario
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado',
        success: false,
        data: null,
      });
    }

    // Validar candidato
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });
    if (!candidate) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Candidato no encontrado',
        success: false,
        data: null,
      });
    }

    // Validar elección
    const election = await this.prisma.election.findUnique({
      where: { id: electionId },
    });
    if (!election) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Elección no encontrada',
        success: false,
        data: null,
      });
    }

    // Verificar unicidad por (userId, electionId, candidateId)
    const existing = await this.prisma.voteIntention.findUnique({
      where: {
        userId_electionId_candidateId: {
          userId,
          electionId,
          candidateId,
        },
      },
    });

    if (existing) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message:
          'La intención de voto para este candidato en esta elección ya está registrada para este usuario',
        success: false,
        data: null,
      });
    }

    const voteIntention = await this.prisma.voteIntention.create({
      data: {
        userId,
        candidateId,
        electionId,
      },
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Intención de voto registrada correctamente',
      success: true,
      data: voteIntention,
    };
  }

  async findAll(): Promise<ServiceResponse<any[]>> {
    const intentions = await this.prisma.voteIntention.findMany({
      include: this.baseInclude,
      orderBy: { createdAt: 'desc' },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Listado de intenciones de voto obtenido correctamente',
      success: true,
      data: intentions,
    };
  }

  async findOne(id: number): Promise<ServiceResponse<any>> {
    const intention = await this.prisma.voteIntention.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!intention) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Intención de voto no encontrada',
        success: false,
        data: null,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Intención de voto obtenida correctamente',
      success: true,
      data: intention,
    };
  }

  async update(
    id: number,
    updateVoteIntentionDto: UpdateVoteIntentionDto,
  ): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.voteIntention.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Intención de voto no encontrada',
        success: false,
        data: null,
      });
    }

    // Valores base actuales
    const newUserId =
      updateVoteIntentionDto.userId ?? existing.userId;
    const newCandidateId =
      updateVoteIntentionDto.candidateId ?? existing.candidateId;
    const newElectionId =
      updateVoteIntentionDto.electionId ?? existing.electionId;

    // Validar nuevas referencias si cambiaron
    if (updateVoteIntentionDto.userId !== undefined) {
      const user = await this.prisma.user.findUnique({
        where: { id: newUserId },
      });
      if (!user) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Usuario no encontrado',
          success: false,
          data: null,
        });
      }
    }

    if (updateVoteIntentionDto.candidateId !== undefined) {
      const candidate = await this.prisma.candidate.findUnique({
        where: { id: newCandidateId },
      });
      if (!candidate) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Candidato no encontrado',
          success: false,
          data: null,
        });
      }
    }

    if (updateVoteIntentionDto.electionId !== undefined) {
      const election = await this.prisma.election.findUnique({
        where: { id: newElectionId },
      });
      if (!election) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Elección no encontrada',
          success: false,
          data: null,
        });
      }
    }

    // Verificar unicidad del nuevo combo
    const duplicate = await this.prisma.voteIntention.findUnique({
      where: {
        userId_electionId_candidateId: {
          userId: newUserId,
          electionId: newElectionId,
          candidateId: newCandidateId,
        },
      },
    });

    if (duplicate && duplicate.id !== id) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message:
          'Ya existe otra intención de voto con esta combinación de usuario, elección y candidato',
        success: false,
        data: null,
      });
    }

    const data: any = {
      userId: newUserId,
      candidateId: newCandidateId,
      electionId: newElectionId,
    };

    const intention = await this.prisma.voteIntention.update({
      where: { id },
      data,
      include: this.baseInclude,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Intención de voto actualizada correctamente',
      success: true,
      data: intention,
    };
  }

  async remove(id: number): Promise<ServiceResponse<any>> {
    const existing = await this.prisma.voteIntention.findUnique({
      where: { id },
      include: this.baseInclude,
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Intención de voto no encontrada',
        success: false,
        data: null,
      });
    }

    await this.prisma.voteIntention.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Intención de voto eliminada correctamente',
      success: true,
      data: existing,
    };
  }
}
