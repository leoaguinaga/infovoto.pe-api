import { PartialType } from '@nestjs/mapped-types';
import { CreatePostModerationAlertDto } from './create-post-moderation-alert.dto';
import {
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ModerationStatus } from 'generated/prisma/client';

export class UpdatePostModerationAlertDto extends PartialType(
  CreatePostModerationAlertDto,
) {
  @ApiPropertyOptional({
    description:
      'Nuevo estado de la alerta (PENDING, APPROVED, REJECTED)',
    enum: ModerationStatus,
    example: ModerationStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(ModerationStatus)
  status?: ModerationStatus;

  @ApiPropertyOptional({
    description:
      'ID del administrador que revisa la alerta de moderación',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  reviewedByAdminId?: number;

  @ApiPropertyOptional({
    description:
      'Fecha/hora de revisión de la alerta. Si no se envía y se cambia el estado a APPROVED o REJECTED, se usará la fecha/hora actual.',
    example: '2025-11-15T21:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  reviewedAt?: string;

  @ApiPropertyOptional({
    description:
      'Permite actualizar el resumen generado por IA si fuera necesario',
    example:
      'Resumen ajustado después de una nueva evaluación automática del contenido.',
  })
  @IsOptional()
  @IsString()
  aiSummary?: string;
}
