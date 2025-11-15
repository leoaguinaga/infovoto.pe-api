import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID del post al que pertenece el comentario',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @ApiProperty({
    description: 'ID del autor del comentario (usuario)',
    example: 12,
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Me parece interesante esta propuesta, pero tengo algunas dudas...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'ID del comentario padre (para respuestas)',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  parentId?: number;
}
