import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiPropertyOptional({
    description: 'Nuevo contenido del comentario',
    example: 'Actualizo mi opinión luego de revisar más información...',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Cambiar el comentario padre (para reubicar la respuesta)',
    example: 4,
  })
  @IsOptional()
  @IsInt()
  parentId?: number;
}
