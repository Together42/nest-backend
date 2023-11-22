import { IEvent } from '@nestjs/cqrs';

export abstract class MeetupEvent implements IEvent {
  constructor(readonly name: string) {}
}
