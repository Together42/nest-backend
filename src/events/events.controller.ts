import { Controller, Delete, Get, Post } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  async create() {
    return await this.eventsService.create();
  }

  @Get()
  async findAll() {
    return await this.eventsService.findAll();
  }

  @Get('ranking')
  async findRanking() {
    return await this.eventsService.findRanking();
  }

  @Get(':id')
  async findOne() {
    return await this.eventsService.findOne();
  }

  @Delete(':id')
  async remove() {
    return await this.eventsService.remove();
  }

  @Post(':id/attendance')
  async createAttendance() {
    return await this.eventsService.createAttendance();
  }

  @Delete(':id/attendance')
  async deleteAttendance() {
    return await this.eventsService.deleteAttendance();
  }

  @Post(':id/matching')
  async createMatching() {
    return await this.eventsService.createMatching();
  }
}
