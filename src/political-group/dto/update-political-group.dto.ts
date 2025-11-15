import { PartialType } from '@nestjs/mapped-types';
import { CreatePoliticalGroupDto } from './create-political-group.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePoliticalGroupDto extends PartialType(
  CreatePoliticalGroupDto,
) {
  @ApiPropertyOptional({
    description: 'Nuevo nombre completo de la agrupación política',
    example: 'Partido Ejemplo Renovado',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Nuevo nombre corto o siglas',
    example: 'PER',
  })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional({
    description: 'Nueva URL del logo de la agrupación',
    example: 'https://misitio.com/logos/per.png',
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Nueva descripción de la agrupación política',
    example: 'Agrupación política con enfoque en transparencia y participación ciudadana.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
