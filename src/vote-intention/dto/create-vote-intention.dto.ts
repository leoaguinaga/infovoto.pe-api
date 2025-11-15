import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateVoteIntentionDto {
  @ApiProperty({
    description: 'ID del usuario que emite la intención de voto',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID del candidato al que se asigna la intención de voto',
    example: 3,
  })
  @IsInt()
  @IsNotEmpty()
  candidateId: number;

  @ApiProperty({
    description: 'ID de la elección en la que se emite la intención de voto',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  electionId: number;
}
