import { PartialType } from '@nestjs/mapped-types';
import { CreateVotingCenterDto } from './create-voting-center.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateVotingCenterDto extends PartialType(
  CreateVotingCenterDto,
) {
  @ApiPropertyOptional({
    description: 'Nombre del local de votación',
    example: 'IE 1234 Los Libertadores - Anexo',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Dirección completa del local de votación',
    example: 'Av. Actualizada 123, San Juan de Lurigancho, Lima',
  })
  @IsOptional()
  @IsString()
  address?: string;

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
}
