import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { EducationLevel } from '@prisma/client';

export class CreateEducationDto {
  @ApiProperty({
    description: 'ID del candidato',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  candidateId: number;

  @ApiProperty({
    description: 'Nivel educativo',
    enum: EducationLevel,
    example: 'MASTER',
  })
  @IsEnum(EducationLevel)
  @IsNotEmpty()
  level: EducationLevel;

  @ApiProperty({
    description: 'Título o grado obtenido',
    example: 'MBA en Administración de Empresas',
  })
  @IsString()
  @IsNotEmpty()
  degree: string;

  @ApiProperty({
    description: 'Universidad o institución',
    example: 'Universidad de Lima',
  })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiProperty({
    description: 'Año de graduación',
    example: 2010,
  })
  @IsInt()
  @Min(1950)
  @Max(2100)
  graduationYear: number;

  @ApiPropertyOptional({
    description: 'Campo de estudio',
    example: 'Administración y Finanzas',
  })
  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @ApiProperty({
    description: 'Orden para mostrar cronológicamente',
    example: 1,
  })
  @IsInt()
  @Min(0)
  order: number;
}
