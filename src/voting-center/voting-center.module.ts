import { Module } from '@nestjs/common';
import { VotingCenterService } from './voting-center.service';
import { VotingCenterController } from './voting-center.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [VotingCenterController],
  providers: [VotingCenterService],
})
export class VotingCenterModule {}
