import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { Repository } from 'typeorm';
import { EventAttendeeEntity } from './entities/event-attendee.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { MatchEventDto } from './dto/match-event.dto';
import { EventUserIdsDto } from './dto/event-user-ids.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(EventAttendeeEntity)
    private eventAttendeeRepository: Repository<EventAttendeeEntity>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = this.eventRepository.create(createEventDto);
    await this.eventRepository.save(event);
  }

  async findAll() {
    const events = await this.eventRepository.find();
    return events;
  }

  async findRanking() {
    const eventPoints = await this.eventAttendeeRepository
      .createQueryBuilder()
      .select('user_id')
      .addSelect('COUNT(event_id)', 'event_points')
      .groupBy('user_id')
      .getRawMany();
    return eventPoints;
  }

  async findOne(id: number) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) return;
    const attendees = await this.eventAttendeeRepository.find({
      where: { eventId: id },
    });
    return { event, attendees };
  }

  async remove(eventUserIdsDto: EventUserIdsDto) {
    const { userId, eventId } = eventUserIdsDto;
    const event = await this.eventRepository.findOne({
      where: { id: eventId, createUserId: userId },
    });
    if (event) await this.eventRepository.softDelete(eventId);
  }

  async createAttendance(eventUserIdsDto: EventUserIdsDto) {
    const { userId, eventId } = eventUserIdsDto;
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) return;
    const attendee = this.eventAttendeeRepository.create({
      userId,
      eventId,
      event,
    });
    await this.eventAttendeeRepository.save(attendee);
  }

  async deleteAttendance(eventUserIdsDto: EventUserIdsDto) {
    const { userId, eventId } = eventUserIdsDto;
    const eventAttendee = await this.eventAttendeeRepository.findOne({
      where: { eventId, userId },
    });
    if (eventAttendee)
      await this.eventAttendeeRepository.softDelete(eventAttendee.id);
  }

  async createMatching(matchEventDto: MatchEventDto) {
    const { eventId, userId, teamNum } = matchEventDto;
    const event = await this.eventRepository.findOne({
      where: { id: eventId, createUserId: userId },
    });
    if (!event || event.matchedAt) return;
    const eventAttendees = await this.eventAttendeeRepository.find({
      where: { eventId: eventId },
    });
    await this.eventRepository.update(eventId, { matchedAt: new Date() });
    const eventAttendeePromise = eventAttendees.map((attendee) => {
      return this.eventAttendeeRepository.update(attendee.id, {
        teamId: teamNum,
      });
    });
    await Promise.all(eventAttendeePromise);
  }
}
