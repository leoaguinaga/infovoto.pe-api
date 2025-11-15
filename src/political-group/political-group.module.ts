import { Module } from '@nestjs/common';
import { PoliticalGroupService } from './political-group.service';
import { PoliticalGroupController } from './political-group.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [PoliticalGroupController],
  providers: [PoliticalGroupService],
})
export class PoliticalGroupModule {}
