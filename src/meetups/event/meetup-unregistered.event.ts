import { MeetupEvent } from 'src/meetups/event/meetup.event';
import { MeetupDto } from '../dto/meetup.dto';

export class MeetupUnregisteredEvent extends MeetupEvent {
  constructor(readonly meetup: Pick<MeetupDto, 'title' | 'description'>) {
    super(MeetupUnregisteredEvent.name);
  }
}
