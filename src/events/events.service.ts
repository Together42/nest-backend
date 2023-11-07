import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { Repository } from 'typeorm';
import { EventAttendeeEntity } from './entities/event-attendee.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(EventAttendeeEntity)
    private eventAttendeeRepository: Repository<EventAttendeeEntity>,
  ) {}

  async create() {
    return;
  }

  async findAll() {
    return;
  }

  async findRanking() {
    return;
  }

  async findOne() {
    return;
  }

  async remove() {
    return;
  }

  async createAttendance() {
    return;
  }

  async deleteAttendance() {
    return;
  }

  async createMatching() {
    return;
  }
}
