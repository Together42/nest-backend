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
import { MeetupsService } from './meetups.service';
import { CreateMeetupBody, CreateMeetupDto } from './dto/create-meetup.dto';
import { MatchMeetupBody, MatchMeetupDto } from './dto/match-meetup.dto';
import { UserRankingDto } from './dto/user-ranking.dto';
import { MeetupDto } from './dto/meetup.dto';
import { MeetupDetailDto } from './dto/meetup-detail.dto';
import { FindMeetupParam } from './dto/find-meetup.dto';
import {
  BadRequestExceptionBody,
  ForbiddenExceptionBody,
  InternalServerExceptionBody,
  NotFoundExceptionBody,
} from '../common/dto/error-response.dto';
import { MeetupIdDto } from './dto/meetup-id.dto';
import { MeetupUserIdsDto } from './dto/meetup-user-ids.dto';

@Controller('meetups')
@ApiTags('meetups')
export class MeetupsController {
  constructor(private meetupsService: MeetupsService) {}

  @Post()
  @ApiOperation({
    summary: '이벤트 생성',
    description:
      '이벤트를 생성한 유저가 자동으로 해당 이벤트의 첫번째 신청자가 됩니다. \
       자동 생성 이벤트인 경우 해당사항 없으며, createUserId도 null입니다.',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: '이벤트 생성 성공', type: MeetupIdDto })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async create(
    @Body() createMeetupBody: CreateMeetupBody,
  ): Promise<MeetupIdDto> {
    const user = { id: 42 };
    const createMeetupDto: CreateMeetupDto = {
      ...createMeetupBody,
      createUserId: user.id,
    };
    return await this.meetupsService.create(createMeetupDto);
  }

  @Get()
  @ApiOperation({ summary: '전체 이벤트 전체 조회' })
  @ApiOkResponse({ type: [MeetupDto] })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async findAll(): Promise<MeetupDto[]> {
    return await this.meetupsService.findAll();
  }

  @Get('ranking')
  @ApiOperation({ summary: '친해지길 바라 점수 및 랭킹 조회' })
  @ApiOkResponse({ type: [UserRankingDto] })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async findUserRanking(): Promise<UserRankingDto[]> {
    return await this.meetupsService.findUserRanking();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 이벤트 조회' })
  @ApiOkResponse({ type: MeetupDetailDto })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiNotFoundResponse({ type: NotFoundExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async findOne(
    @Param() findMeetupParam: FindMeetupParam,
  ): Promise<MeetupDetailDto> {
    return await this.meetupsService.findOne(findMeetupParam);
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
  async remove(@Param() findMeetupParam: FindMeetupParam): Promise<void> {
    const user = { id: 42 };
    const removeMeetupDto: MeetupUserIdsDto = {
      meetupId: findMeetupParam.id,
      userId: user.id,
    };
    return await this.meetupsService.remove(removeMeetupDto);
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
  async registerMeetup(@Param() findMeetupParam: FindMeetupParam) {
    const user = { id: 42 };
    const registerMeetupDto: MeetupUserIdsDto = {
      meetupId: findMeetupParam.id,
      userId: user.id,
    };
    return await this.meetupsService.registerMeetup(registerMeetupDto);
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
  async unregisterMeetup(
    @Param() findMeetupParam: FindMeetupParam,
  ): Promise<void> {
    const user = { id: 42 };
    const unregisterMeetupDto: MeetupUserIdsDto = {
      meetupId: findMeetupParam.id,
      userId: user.id,
    };
    return await this.meetupsService.unregisterMeetup(unregisterMeetupDto);
  }

  @Post(':id/matching')
  @ApiOperation({
    summary: '특정 이벤트 매칭',
    description:
      '이벤트를 생성한 유저와 관리자, 그리고 이벤트 신청자만 이벤트 매칭이 가능힙니다. \
       이미 매칭한 이벤트를 한번 더 매칭할 수는 없습니다.',
  })
  @ApiBearerAuth()
  @ApiBody({ required: false, type: MatchMeetupBody })
  @ApiCreatedResponse({
    type: MeetupDetailDto,
    description: '이벤트 매칭 성공',
  })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiNotFoundResponse({ type: NotFoundExceptionBody })
  @ApiForbiddenResponse({ type: ForbiddenExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async createMatching(
    @Param() findMeetupParam: FindMeetupParam,
    @Body() matchMeetupBody: MatchMeetupBody,
  ): Promise<void> {
    const user = { id: 42 };
    const { teamNum } = matchMeetupBody;
    const matchMeetupDto: MatchMeetupDto = {
      teamNum,
      meetupId: findMeetupParam.id,
      userId: user.id,
    };
    return await this.meetupsService.createMatching(matchMeetupDto);
  }
}
