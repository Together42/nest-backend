import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { EventsService } from 'src/events/events.service';
import { CronJob } from 'cron';
import { EventCategory } from 'src/events/enum/event-category.enum';

@Injectable()
export class BatchService {
  constructor(
    private schedulerReistry: SchedulerRegistry,
    private eventsService: EventsService,
  ) {}

  @Cron('0 14 * * 3', { name: 'createWeeklyDinner', timeZone: 'Asia/Seoul' })
  async createWeeklyDinner() {
    const createEventDto: CreateEventDto = {
      title: '[주간 식사] 오늘 주간 회의 끝나고 같이 저녁 드실 분~',
      description: '같이 회의도 하고 식사도 하면서 친해집시다!',
      categoryId: EventCategory.WEEKLY_DINNER,
    };
    const { eventId } = await this.eventsService.create(createEventDto);

    // 생성한 이벤트 마감 크론잡 등록 및 실행
    const cronJob = CronJob.from({
      cronTime: '0 18 * * 3',
      timeZone: 'Asia/Seoul',
      onTick: async () => {
        try {
          await this.eventsService.createMatching({ eventId, teamNum: 1 });
        } catch (e) {
          console.log(e);
        }
      },
    });
    this.schedulerReistry.addCronJob('matchWeeklyDinner', cronJob);
    cronJob.start();
  }
}
