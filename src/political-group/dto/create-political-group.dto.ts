import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePoliticalGroupDto {
  @ApiProperty({
    description: 'Nombre completo de la agrupación política',
    example: 'Partido Ejemplo del Perú',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Nombre corto o siglas de la agrupación política',
    example: 'PEP',
  })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional({
    description: 'URL del logo oficial de la agrupación',
    example: 'https://misitio.com/logos/pep.png',
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Descripción breve de la agrupación política',
    example: 'Agrupación política orientada a la reforma del sistema electoral.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
