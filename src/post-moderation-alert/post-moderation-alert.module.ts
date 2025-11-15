import { Module } from '@nestjs/common';
import { PostModerationAlertService } from './post-moderation-alert.service';
import { PostModerationAlertController } from './post-moderation-alert.controller';

@Module({
  controllers: [PostModerationAlertController],
  providers: [PostModerationAlertService],
})
export class PostModerationAlertModule {}
