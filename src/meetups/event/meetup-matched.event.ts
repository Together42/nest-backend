import { MeetupEvent } from 'src/meetups/event/meetup.event';
import { MeetupDetailDto } from '../dto/meetup-detail.dto';

export class MeetupMatchedEvent extends MeetupEvent {
  constructor(readonly meetupDetail: MeetupDetailDto) {
    super(MeetupMatchedEvent.name);
  }
}
