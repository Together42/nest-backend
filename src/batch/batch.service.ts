import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CreateMeetupDto } from 'src/meetups/dto/create-meetup.dto';
import { MeetupsService } from 'src/meetups/meetups.service';
import { CronJob } from 'cron';
import { MeetupCategory } from 'src/meetups/enum/meetup-category.enum';

@Injectable()
export class BatchService {
  constructor(
    private schedulerReistry: SchedulerRegistry,
    private meetupsService: MeetupsService,
  ) {}

  @Cron('0 14 * * 1', { name: 'createWeeklyMeeting', timeZone: 'Asia/Seoul' })
  async createWeeklyMeeting() {
    const meetingDate = new Date();
    meetingDate.setDate(meetingDate.getDate() + 2);
    const meetingMonth = meetingDate.getMonth() + 1;
    const meetingDay = meetingDate.getDate();

    const createMeetupDto: CreateMeetupDto = {
      title: `[주간회의] ${meetingMonth}월 ${meetingDay}일`,
      description: '매 주 생성되는 정기 회의입니다.',
      categoryId: MeetupCategory.WEEKLY_MEETUP,
    };
    const { meetupId } = await this.meetupsService.create(createMeetupDto);

    // 생성한 이벤트 마감 크론잡 등록 및 실행
    const cronJob = CronJob.from({
      cronTime: '0 17 * * 3',
      timeZone: 'Asia/Seoul',
      onTick: async () => {
        try {
          await this.meetupsService.createMatching({ meetupId, teamNum: 1 });
        } catch (e) {
          console.log(e);
        }
      },
    });
    this.schedulerReistry.addCronJob('matchWeeklyMeeting', cronJob);
    cronJob.start();
  }

  @Cron('0 14 * * 3', { name: 'createWeeklyDinner', timeZone: 'Asia/Seoul' })
  async createWeeklyDinner() {
    const createMeetupDto: CreateMeetupDto = {
      title: '[주간 식사] 회의 끝나고 같이 저녁 드실 분~',
      description: '금일 오후 6시에 자동 마감됩니다.',
      categoryId: MeetupCategory.WEEKLY_MEETUP,
    };
    const { meetupId } = await this.meetupsService.create(createMeetupDto);

    // 생성한 이벤트 마감 크론잡 등록 및 실행
    const cronJob = CronJob.from({
      cronTime: '0 18 * * 3',
      timeZone: 'Asia/Seoul',
      onTick: async () => {
        try {
          await this.meetupsService.createMatching({ meetupId, teamNum: 1 });
        } catch (e) {
          console.log(e);
        }
      },
    });
    this.schedulerReistry.addCronJob('matchWeeklyDinner', cronJob);
    cronJob.start();
  }
}
