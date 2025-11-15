import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { VoterModule } from './voter/voter.module';
import { TableMemberModule } from './table-member/table-member.module';
import { ElectionModule } from './election/election.module';
import { ElectoralEventModule } from './electoral-event/electoral-event.module';
import { PoliticalGroupModule } from './political-group/political-group.module';
import { CandidateModule } from './candidate/candidate.module';
import { GovernmentPlanModule } from './government-plan/government-plan.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { VoteIntentionModule } from './vote-intention/vote-intention.module';
import { PostModerationAlertModule } from './post-moderation-alert/post-moderation-alert.module';
import { VotingCenterModule } from './voting-center/voting-center.module';
import { VotingTableModule } from './voting-table/voting-table.module';
import { GuideContentModule } from './guide-content/guide-content.module';
import { NewsItemModule } from './news-item/news-item.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule, UserModule, VoterModule, TableMemberModule, ElectionModule, ElectoralEventModule, PoliticalGroupModule, CandidateModule, GovernmentPlanModule, PostModule, CommentModule, VoteIntentionModule, PostModerationAlertModule, VotingCenterModule, VotingTableModule, GuideContentModule, NewsItemModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
