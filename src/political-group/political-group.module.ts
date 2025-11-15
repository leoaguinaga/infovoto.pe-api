import { Module } from '@nestjs/common';
import { PoliticalGroupService } from './political-group.service';
import { PoliticalGroupController } from './political-group.controller';

@Module({
  controllers: [PoliticalGroupController],
  providers: [PoliticalGroupService],
})
export class PoliticalGroupModule {}
