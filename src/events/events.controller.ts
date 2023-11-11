import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventBody, CreateEventDto } from './dto/create-event.dto';
import { MatchEventBody, MatchEventDto } from './dto/match-event.dto';
import { EventRankingDto } from './dto/event-ranking.dto';
import { EventDto } from './dto/event.dto';
import { EventDetailDto } from './dto/event-detail.dto';
import { FindEventParam } from './dto/find-event.dto';
import { RemoveEventDto } from './dto/remove-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { UnregisterEventDto } from './dto/unregister-event.dto';

@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: '이벤트 생성' })
  @ApiBearerAuth()
  async create(@Body() createEventBody: CreateEventBody): Promise<void> {
    const user = { id: 42 };
    const createEventDto: CreateEventDto = {
      ...createEventBody,
      createUserId: user.id,
    };
    return await this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: '전체 이벤트 전체 조회' })
  @ApiOkResponse({ type: [EventDto] })
  async findAll(): Promise<EventDto[]> {
    return await this.eventsService.findAll();
  }

  @Get('ranking')
  @ApiOperation({ summary: '친해지길 바라 점수 및 랭킹 조회' })
  @ApiOkResponse({ type: [EventRankingDto] })
  async findRanking(): Promise<EventRankingDto[]> {
    return await this.eventsService.findRanking();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 이벤트 조회' })
  @ApiOkResponse({ type: EventDetailDto })
  async findOne(
    @Param() findEventParam: FindEventParam,
  ): Promise<EventDetailDto> {
    return await this.eventsService.findOne(findEventParam);
  }

  @Delete(':id')
  @ApiOperation({ summary: '특정 이벤트 삭제' })
  @ApiBearerAuth()
  async remove(@Param() findEventParam: FindEventParam): Promise<void> {
    const user = { id: 42 };
    const removeEventDto: RemoveEventDto = {
      eventId: findEventParam.id,
      userId: user.id,
    };
    return await this.eventsService.remove(removeEventDto);
  }

  @Post(':id/attendance')
  @ApiOperation({ summary: '특정 이벤트에 참석' })
  @ApiBearerAuth()
  async registerEvent(@Param() findEventParam: FindEventParam) {
    const user = { id: 42 };
    const registerEventDto: RegisterEventDto = {
      eventId: findEventParam.id,
      userId: user.id,
    };
    return await this.eventsService.registerEvent(registerEventDto);
  }

  @Delete(':id/attendance')
  @ApiOperation({ summary: '특정 이벤트 참석 취소' })
  @ApiBearerAuth()
  async unregisterEvent(
    @Param() findEventParam: FindEventParam,
  ): Promise<void> {
    const user = { id: 42 };
    const unregisterEventDto: UnregisterEventDto = {
      eventId: findEventParam.id,
      userId: user.id,
    };
    return await this.eventsService.unregisterEvent(unregisterEventDto);
  }

  @Post(':id/matching')
  @ApiOperation({ summary: '특정 이벤트 매칭' })
  @ApiBearerAuth()
  @ApiBody({ required: false, type: MatchEventBody })
  async createMatching(
    @Param() findEventParam: FindEventParam,
    @Body() matchEventBody: MatchEventBody,
  ): Promise<void> {
    const user = { id: 42 };
    const { teamNum = 1 } = matchEventBody;
    const matchEventDto: MatchEventDto = {
      teamNum,
      eventId: findEventParam.id,
      userId: user.id,
    };
    return await this.eventsService.createMatching(matchEventDto);
  }
}
