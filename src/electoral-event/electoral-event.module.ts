import { Module } from '@nestjs/common';
import { ElectoralEventService } from './electoral-event.service';
import { ElectoralEventController } from './electoral-event.controller';

@Module({
  controllers: [ElectoralEventController],
  providers: [ElectoralEventService],
})
export class ElectoralEventModule {}
