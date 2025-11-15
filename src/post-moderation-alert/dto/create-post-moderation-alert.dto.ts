import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ModerationStatus } from '@prisma/client';

export class CreatePostModerationAlertDto {
  @ApiProperty({
    description: 'ID del post que genera la alerta de moderación',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @ApiProperty({
    description:
      'Resumen generado por IA explicando por qué el post podría ser inadecuado',
    example:
      'El post contiene afirmaciones potencialmente difamatorias hacia otra candidatura.',
  })
  @IsString()
  @IsNotEmpty()
  aiSummary: string;

  @ApiPropertyOptional({
    description:
      'Estado de la alerta de moderación (por defecto PENDING si no se envía)',
    enum: ModerationStatus,
    example: ModerationStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ModerationStatus)
  status?: ModerationStatus;
}
