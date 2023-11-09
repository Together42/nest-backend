import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { MatchEventDto } from './dto/match-event.dto';
import { FindEventDto } from './dto/find-event.dto';
import { EventRankingDto } from './dto/event-ranking.dto';
import { EventDto } from './dto/event.dto';

@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: '이벤트 생성' })
  @ApiBearerAuth()
  async create(@Body() createEventDto: CreateEventDto) {
    const user = { id: 42 };
    createEventDto.createUserId = user.id;
    return await this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: '전체 이벤트 전체 조회' })
  @ApiOkResponse({ type: [EventDto] })
  async findAll() {
    return await this.eventsService.findAll();
  }

  @Get('ranking')
  @ApiOperation({ summary: '친해지길 바라 점수 및 랭킹 조회' })
  @ApiOkResponse({ type: [EventRankingDto] })
  async findRanking() {
    return await this.eventsService.findRanking();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 이벤트 조회' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOkResponse({ type: FindEventDto })
  async findOne(@Param('id') id: number) {
    return await this.eventsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '특정 이벤트 삭제' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'number' })
  async remove(@Param('id') id: number) {
    const user = { id: 42 };
    return await this.eventsService.remove({ eventId: id, userId: user.id });
  }

  @Post(':id/attendance')
  @ApiOperation({ summary: '특정 이벤트에 참석' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'number' })
  async createAttendance(@Param('id') id: number) {
    const user = { id: 42 };
    return await this.eventsService.createAttendance({
      eventId: id,
      userId: user.id,
    });
  }

  @Delete(':id/attendance')
  @ApiOperation({ summary: '특정 이벤트 참석 취소' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'number' })
  async deleteAttendance(@Param('id') id: number) {
    const user = { id: 42 };
    return await this.eventsService.deleteAttendance({
      eventId: id,
      userId: user.id,
    });
  }

  @Post(':id/matching')
  @ApiOperation({ summary: '특정 이벤트 매칭' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ required: false, type: MatchEventDto })
  async createMatching(
    @Param('id') id: number,
    @Body() matchEventDto: MatchEventDto,
  ) {
    const user = { id: 42 };
    matchEventDto.eventId = id;
    matchEventDto.userId = user.id;
    return await this.eventsService.createMatching(matchEventDto);
  }
}
