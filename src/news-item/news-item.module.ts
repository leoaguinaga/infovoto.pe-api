import { Module } from '@nestjs/common';
import { NewsItemService } from './news-item.service';
import { NewsItemController } from './news-item.controller';

@Module({
  controllers: [NewsItemController],
  providers: [NewsItemService],
})
export class NewsItemModule {}
