import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVotingCenterDto {
  @ApiProperty({
    description: 'Nombre del local de votación',
    example: 'IE 1234 Los Libertadores',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Dirección completa del local de votación',
    example: 'Av. Siempre Viva 742, San Juan de Lurigancho, Lima',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({
    description: 'Latitud del local de votación',
    example: -12.046373,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitud del local de votación',
    example: -77.042754,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Departamento donde se ubica el local',
    example: 'Lima',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    description: 'Provincia donde se ubica el local',
    example: 'Lima',
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({
    description: 'Distrito donde se ubica el local',
    example: 'San Juan de Lurigancho',
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({
    description: 'URL del croquis/mapa del local de votación',
    example: '/uploads/voting-centers/sketch-1234567890.png',
  })
  @IsOptional()
  @IsString()
  sketchUrl?: string;
}
