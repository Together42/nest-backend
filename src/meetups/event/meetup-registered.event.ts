import { MeetupEvent } from 'src/meetups/event/meetup.event';
import { MeetupDto } from '../dto/meetup.dto';

export class MeetupRegisteredEvent extends MeetupEvent {
  constructor(readonly meetup: MeetupDto) {
    super(MeetupRegisteredEvent.name);
  }
}
