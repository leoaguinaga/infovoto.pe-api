import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateWorkExperienceDto {
  @ApiProperty({
    description: 'ID del candidato',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  candidateId: number;

  @ApiProperty({
    description: 'Cargo o posición ocupada',
    example: 'GERENTE GENERAL',
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    description: 'Empresa o institución',
    example: 'Banco Continental',
  })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({
    description: 'Año de inicio',
    example: 2015,
  })
  @IsInt()
  @Min(1950)
  @Max(2100)
  startYear: number;

  @ApiPropertyOptional({
    description: 'Año de fin (null si es actual)',
    example: 2020,
  })
  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(2100)
  endYear?: number;

  @ApiProperty({
    description: 'Indica si es el trabajo actual',
    example: false,
  })
  @IsBoolean()
  isCurrent: boolean;

  @ApiPropertyOptional({
    description: 'Descripción de responsabilidades',
    example: 'Gestión de operaciones bancarias...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Orden para mostrar cronológicamente',
    example: 1,
  })
  @IsInt()
  @Min(0)
  order: number;
}
