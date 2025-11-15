import { Module } from '@nestjs/common';
import { VoteIntentionService } from './vote-intention.service';
import { VoteIntentionController } from './vote-intention.controller';

@Module({
  controllers: [VoteIntentionController],
  providers: [VoteIntentionService],
})
export class VoteIntentionModule {}
