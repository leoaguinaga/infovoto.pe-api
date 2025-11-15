import { Module } from '@nestjs/common';
import { VotingTableService } from './voting-table.service';
import { VotingTableController } from './voting-table.controller';

@Module({
  controllers: [VotingTableController],
  providers: [VotingTableService],
})
export class VotingTableModule {}
