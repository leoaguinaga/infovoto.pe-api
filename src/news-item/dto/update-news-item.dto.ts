import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsItemDto } from './create-news-item.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateNewsItemDto extends PartialType(CreateNewsItemDto) {
  @ApiPropertyOptional({
    description: 'Nuevo título de la noticia',
    example: 'ONPE actualiza cronograma para elecciones generales 2026',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Nuevo resumen de la noticia',
    example:
      'La ONPE realizó ajustes en el cronograma electoral para el proceso 2026.',
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({
    description: 'Nuevo contenido completo de la noticia',
    example:
      'En la última publicación oficial, la ONPE informó sobre cambios en las fechas...',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Nueva fuente de la noticia',
    example: 'El Comercio',
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: 'Nueva URL de la noticia en la fuente original',
    example: 'https://elcomercio.pe/politica/onpe-actualiza-cronograma-2026',
  })
  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @ApiPropertyOptional({
    description: 'Nueva fecha de publicación de la noticia',
    example: '2025-11-16T09:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({
    description: 'ID de la elección asociada (puede cambiar o quedar sin elección)',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  electionId?: number;

  @ApiPropertyOptional({
    description:
      'ID de la agrupación política asociada (puede cambiar o quedar sin agrupación)',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  politicalGroupId?: number;
}
