import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from 'generated/prisma/client';

export class CreatePostDto {
  @ApiProperty({
    description: 'Título del post',
    example: 'Presentación del plan de gobierno 2026-2031',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Contenido del post',
    example:
      'En este post presento los principales ejes de mi plan de gobierno 2026-2031...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description:
      'Estado del post (por defecto PUBLISHED si no se envía)',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiProperty({
    description: 'ID del autor (usuario con rol candidato en el sistema)',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;

  @ApiPropertyOptional({
    description: 'ID del candidato al que se asocia el post',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  candidateId?: number;
}
