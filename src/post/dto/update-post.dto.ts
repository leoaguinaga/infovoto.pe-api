import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { PostStatus } from 'generated/prisma/client';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({
    description: 'Estado del post',
    enum: PostStatus,
    example: PostStatus.HIDDEN,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional({
    description: 'ID del candidato al que se asocia el post',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  candidateId?: number;
}
