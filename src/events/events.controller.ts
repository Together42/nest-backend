import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
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
import {
  BadRequestExceptionBody,
  ForbiddenExceptionBody,
  InternalServerExceptionBody,
  NotFoundExceptionBody,
} from '../utils/dto/error-response.dto';

@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @ApiOperation({
    summary: '이벤트 생성',
    description:
      '이벤트를 생성한 유저가 자동으로 해당 이벤트의 첫번째 신청자가 됩니다. \
       자동 생성 이벤트인 경우 해당사항 없으며, createUserId도 null입니다.',
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiCreatedResponse({ description: '이벤트 생성 성공' })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
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
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async findAll(): Promise<EventDto[]> {
    return await this.eventsService.findAll();
  }

  @Get('ranking')
  @ApiOperation({ summary: '친해지길 바라 점수 및 랭킹 조회' })
  @ApiOkResponse({ type: [EventRankingDto] })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async findRanking(): Promise<EventRankingDto[]> {
    return await this.eventsService.findRanking();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 이벤트 조회' })
  @ApiOkResponse({ type: EventDetailDto })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiNotFoundResponse({ type: NotFoundExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async findOne(
    @Param() findEventParam: FindEventParam,
  ): Promise<EventDetailDto> {
    return await this.eventsService.findOne(findEventParam);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '특정 이벤트 삭제',
    description: '이벤트를 생성한 유저와 관리자만 이벤트 삭제가 가능힙니다.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: '이벤트 삭제 성공' })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiNotFoundResponse({ type: NotFoundExceptionBody })
  @ApiForbiddenResponse({ type: ForbiddenExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async remove(@Param() findEventParam: FindEventParam): Promise<void> {
    const user = { id: 42 };
    const removeEventDto: RemoveEventDto = {
      eventId: findEventParam.id,
      userId: user.id,
    };
    return await this.eventsService.remove(removeEventDto);
  }

  @Post(':id/attendance')
  @ApiOperation({
    summary: '특정 이벤트에 참석',
    description:
      '매칭이 안된 이벤트만 참가 가능하며, 같은 이벤트에 중복 신청이 불가합니다.',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: '이벤트 신청 성공' })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiNotFoundResponse({ type: NotFoundExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async registerEvent(@Param() findEventParam: FindEventParam) {
    const user = { id: 42 };
    const registerEventDto: RegisterEventDto = {
      eventId: findEventParam.id,
      userId: user.id,
    };
    return await this.eventsService.registerEvent(registerEventDto);
  }

  @Delete(':id/attendance')
  @ApiOperation({
    summary: '특정 이벤트 참석 취소',
    description:
      '취소를 요청한 유저가 해당 이벤트에 신청한 내역이 있어야 취소할 수 있습니다.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: '이벤트 신청 취소 성공' })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiNotFoundResponse({ type: NotFoundExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
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
  @ApiOperation({
    summary: '특정 이벤트 매칭',
    description:
      '이벤트를 생성한 유저와 관리자, 그리고 이벤트 신청자만 이벤트 매칭이 가능힙니다. \
       이미 매칭한 이벤트를 한번 더 매칭할 수는 없습니다.',
  })
  @ApiBearerAuth()
  @ApiBody({ required: false, type: MatchEventBody })
  @ApiCreatedResponse({ description: '이벤트 매칭 성공' })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiNotFoundResponse({ type: NotFoundExceptionBody })
  @ApiForbiddenResponse({ type: ForbiddenExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async createMatching(
    @Param() findEventParam: FindEventParam,
    @Body() matchEventBody: MatchEventBody,
  ): Promise<void> {
    const user = { id: 42 };
    const { teamNum } = matchEventBody;
    const matchEventDto: MatchEventDto = {
      teamNum,
      eventId: findEventParam.id,
      userId: user.id,
    };
    return await this.eventsService.createMatching(matchEventDto);
  }
}
