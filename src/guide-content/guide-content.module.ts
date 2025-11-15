import { Module } from '@nestjs/common';
import { GuideContentService } from './guide-content.service';
import { GuideContentController } from './guide-content.controller';

@Module({
  controllers: [GuideContentController],
  providers: [GuideContentService],
})
export class GuideContentModule {}
