import { Module } from '@nestjs/common';
import { GuideContentService } from './guide-content.service';
import { GuideContentController } from './guide-content.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [GuideContentController],
  providers: [GuideContentService],
})
export class GuideContentModule {}
