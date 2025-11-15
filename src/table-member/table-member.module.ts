import { Module } from '@nestjs/common';
import { TableMemberService } from './table-member.service';
import { TableMemberController } from './table-member.controller';

@Module({
  controllers: [TableMemberController],
  providers: [TableMemberService],
})
export class TableMemberModule {}
