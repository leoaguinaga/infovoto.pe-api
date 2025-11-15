import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateNewsItemDto {
  @ApiProperty({
    description: 'Título de la noticia',
    example: 'ONPE publica cronograma para elecciones generales 2026',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Resumen breve de la noticia',
    example:
      'La ONPE difundió el cronograma oficial para las elecciones generales 2026, que incluye las fechas claves del proceso.',
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({
    description: 'Contenido completo de la noticia',
    example:
      'Según lo publicado por la ONPE, el cronograma electoral para el proceso 2026 incluye...',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Fuente de la noticia (ONPE, JNE, medio de comunicación, etc.)',
    example: 'ONPE',
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: 'URL de la noticia en la fuente original',
    example: 'https://www.onpe.gob.pe/elecciones-2026/cronograma-oficial',
  })
  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @ApiPropertyOptional({
    description: 'Fecha de publicación de la noticia',
    example: '2025-11-15T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({
    description: 'ID de la elección asociada a la noticia (opcional)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  electionId?: number;

  @ApiPropertyOptional({
    description: 'ID de la agrupación política asociada a la noticia (opcional)',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  politicalGroupId?: number;
}
