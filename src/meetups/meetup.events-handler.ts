import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MeetupCreatedEvent } from './event/meetup-created.event';
import { SlackService } from 'nestjs-slack';
import {
  meetupCreatedMessage,
  meetupMatchedMessage,
  meetupRegisteredMessage,
  meetupUnregisteredMessage,
} from 'src/common/utils';
import { SlackMessageDto } from 'slack-block-builder';
import { MeetupMatchedEvent } from './event/meetup-matched.event';
import { MeetupEvent } from 'src/meetups/event/meetup.event';
import { MeetupRegisteredEvent } from './event/meetup-registered.event';
import { MeetupUnregisteredEvent } from './event/meetup-unregistered.event';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@EventsHandler(MeetupEvent)
export class MeetupEventsHandler implements IEventHandler<MeetupEvent> {
  constructor(
    private slackService: SlackService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(MeetupEventsHandler.name);

  async handle(meetupEvent: MeetupEvent) {
    try {
      let message: Readonly<SlackMessageDto>;

      switch (meetupEvent.name) {
        case MeetupCreatedEvent.name:
          message = meetupCreatedMessage({
            channel: this.configService.get('slack.jiphyeonjeonChannel'),
            meetup: (meetupEvent as MeetupCreatedEvent).meetup,
          });
          break;

        case MeetupMatchedEvent.name:
          message = meetupMatchedMessage({
            channel: this.configService.get('slack.jiphyeonjeonChannel'),
            meetupDetail: (meetupEvent as MeetupMatchedEvent).meetupDetail,
          });
          break;

        // case MeetupRegisteredEvent.name:
        //   message = meetupRegisteredMessage({
        //     channel: this.configService.get('slack.jiphyeonjeonChannel'),
        //     meetup: (meetupEvent as MeetupRegisteredEvent).meetup,
        //   });
        //   break;

        // case MeetupUnregisteredEvent.name:
        //   message = meetupUnregisteredMessage({
        //     channel: this.configService.get('slack.jiphyeonjeonChannel'),
        //     meetup: (meetupEvent as MeetupRegisteredEvent).meetup,
        //   });
        //   break;

        default:
          break;
      }

      await this.slackService.postMessage(message!);
    } catch (e) {
      this.logger.error('[handle]', e);
    }
  }
}
