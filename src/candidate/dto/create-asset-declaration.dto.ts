import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateAssetDeclarationDto {
  @ApiProperty({
    description: 'ID del candidato',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  candidateId: number;

  @ApiProperty({
    description: 'Año de la declaración',
    example: 2024,
  })
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiProperty({
    description: 'Ingresos totales declarados',
    example: 150000.50,
  })
  @IsNumber()
  @Min(0)
  declaredIncome: number;

  @ApiProperty({
    description: 'Moneda (PEN, USD, etc.)',
    example: 'PEN',
    default: 'PEN',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiPropertyOptional({
    description: 'Fuente de la declaración',
    example: 'JNE',
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada',
    example: 'Incluye salarios, rentas y dividendos',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Ingresos por salario',
    example: 120000.00,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryIncome?: number;

  @ApiPropertyOptional({
    description: 'Ingresos por rentas',
    example: 20000.00,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rentalIncome?: number;

  @ApiPropertyOptional({
    description: 'Ingresos por dividendos',
    example: 10000.00,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dividendIncome?: number;

  @ApiPropertyOptional({
    description: 'Otros ingresos',
    example: 500.50,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  otherIncome?: number;
}
