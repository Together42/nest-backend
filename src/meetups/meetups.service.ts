import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetupEntity } from './entity/meetup.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { MeetupAttendeeEntity } from './entity/meetup-attendee.entity';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { MatchMeetupDto } from './dto/match-meetup.dto';
import { UserRankingDto } from './dto/user-ranking.dto';
import { FindMeetupDto } from './dto/find-meetup.dto';
import { MeetupDetailDto } from './dto/meetup-detail.dto';
import { MeetupDto } from './dto/meetup.dto';
import { ErrorMessage } from 'src/common/enum/error-message.enum';
import {
  isHttpException,
  createMeetupMessage,
  shuffleArray,
  matchMeetupMessage,
  registerMeetupMessage,
  unregisterMeetupMessage,
} from 'src/common/utils';
import { MeetupUserIdsDto } from './dto/meetup-user-ids.dto';
import { SlackService } from 'nestjs-slack';

@Injectable()
export class MeetupsService {
  constructor(
    private dataSource: DataSource,
    private slackService: SlackService,
    @InjectRepository(MeetupEntity)
    private meetupRepository: Repository<MeetupEntity>,
    @InjectRepository(MeetupAttendeeEntity)
    private meetupAttendeeRepository: Repository<MeetupAttendeeEntity>,
  ) {}

  async create(createMeetupDto: CreateMeetupDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const meetup = this.meetupRepository.create(createMeetupDto);
      const { id, title, description, createUserId } =
        await queryRunner.manager.save(meetup);
      if (createUserId) {
        const firstAttendee = this.meetupAttendeeRepository.create({
          meetupId: id,
          userId: createUserId,
        });
        await queryRunner.manager.save(firstAttendee);
      }

      // 이벤트 생성시 슬랙봇으로 이벤트 정보 전송
      const message = createMeetupMessage({
        channel: process.env.SLACK_CHANNEL_JIPHYEONJEON!,
        meetupTitle: title,
        meetupDescription: description,
      });
      await this.slackService.postMessage(message);
      await queryRunner.commitTransaction();
      return { meetupId: id };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (isHttpException(e))
        throw new HttpException(e.getResponse(), e.getStatus());
      else throw new Error();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const meetups = await this.meetupRepository.find();
    const meetupDtos = meetups.map((meetup) => MeetupDto.from(meetup));
    return meetupDtos;
  }

  async findUserRanking() {
    // TODO: 쿼리빌더가 타입 반환을 any로 반환하는 것을 해결하기
    const userRanking: UserRankingDto[] = await this.meetupAttendeeRepository
      .createQueryBuilder()
      .select('user_id')
      .addSelect('COUNT(meetup_id)', 'meetup_points')
      .groupBy('user_id')
      .getRawMany();
    return userRanking;
  }

  async findOne(findMeetupDto: FindMeetupDto) {
    const { id } = findMeetupDto;
    const meetup = await this.meetupRepository.findOne({
      where: { id },
      relations: ['attendees'],
    });
    if (!meetup) {
      throw new NotFoundException(ErrorMessage.MEETUP_NOT_FOUND);
    }
    const meetupDetailDto = MeetupDetailDto.from(meetup);
    return meetupDetailDto;
  }

  /**
   * 유저가 서비스의 관리자인지 판별
   */
  private isAdminUser(userId: number): boolean {
    // TODO: 유저 엔티티를 조회하여 유저가 관리자인지 확인해야함, 유저 모듈로 빼기
    userId;
    return true;
  }

  /**
   * 유저가 해당 이벤트를 생성한 유저인지 판별
   */
  private isMeetupOwner(meetup: MeetupEntity, targetUserId: number): boolean {
    return meetup.createUserId === targetUserId;
  }

  /**
   * 유저가 이벤트 참여자 중 하나인지 판별
   */
  private isMeetupAttendee(
    meetupAttendees: MeetupAttendeeEntity[],
    targetUserId: number,
  ): boolean {
    return meetupAttendees.some((attendee) => attendee.userId === targetUserId);
  }

  /**
   * 유저가 이벤트 참여자 중 하나인지 판별하고 정보 가져오기
   */
  private findMeetupAttendee(
    meetupAttendees: MeetupAttendeeEntity[],
    targetUserId: number,
  ) {
    return meetupAttendees.find((attendee) => attendee.userId === targetUserId);
  }

  async remove(meetupUserIdsDto: MeetupUserIdsDto) {
    const { userId, meetupId } = meetupUserIdsDto;
    const meetup = await this.meetupRepository.findOneBy({ id: meetupId });
    if (!meetup) {
      throw new NotFoundException(ErrorMessage.MEETUP_NOT_FOUND);
    }
    if (!(this.isMeetupOwner(meetup, userId) || this.isAdminUser(userId))) {
      throw new ForbiddenException(ErrorMessage.NO_PERMISSION);
    }
    await this.meetupRepository.update(meetup.id, {
      deletedAt: new Date(),
      deleteUserId: userId,
    });
  }

  async registerMeetup(meetupUserIdsDto: MeetupUserIdsDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { meetupId, userId } = meetupUserIdsDto;
      const meetup = await queryRunner.manager.findOne(MeetupEntity, {
        where: { id: meetupId, matchedAt: IsNull() },
        relations: ['attendees'],
      });
      if (!meetup) {
        throw new NotFoundException(ErrorMessage.MEETUP_NOT_FOUND_OR_CLOSED);
      }
      if (this.isMeetupAttendee(meetup.attendees, userId)) {
        throw new BadRequestException(
          ErrorMessage.MEETUP_REGISTRATION_ALREADY_EXIST,
        );
      }
      const attendance = this.meetupAttendeeRepository.create(meetupUserIdsDto);
      await queryRunner.manager.save(attendance);

      const message = registerMeetupMessage({
        channel: process.env.SLACK_CHANNEL_JIPHYEONJEON!,
        meetupTitle: meetup.title,
      });
      await this.slackService.postMessage(message);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (isHttpException(e)) {
        throw new HttpException(e.getResponse(), e.getStatus());
      }
      throw new Error();
    } finally {
      await queryRunner.release();
    }
  }

  async unregisterMeetup(meetupUserIdsDto: MeetupUserIdsDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { meetupId, userId } = meetupUserIdsDto;
      const meetup = await queryRunner.manager.findOne(MeetupEntity, {
        where: { id: meetupId, matchedAt: IsNull() },
        relations: ['attendees'],
      });
      if (!meetup) {
        throw new NotFoundException(ErrorMessage.MEETUP_NOT_FOUND_OR_CLOSED);
      }
      const meetupAttendee = this.findMeetupAttendee(meetup.attendees, userId);
      if (!meetupAttendee) {
        throw new NotFoundException(ErrorMessage.MEETUP_REGISTRATION_NOT_FOUND);
      }
      await this.meetupAttendeeRepository.softDelete(meetupAttendee.id);
      const message = unregisterMeetupMessage({
        channel: process.env.SLACK_CHANNEL_JIPHYEONJEON!,
        meetupTitle: `${meetup.title}`,
      });
      await this.slackService.postMessage(message);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (isHttpException(e)) {
        throw new HttpException(e.getResponse(), e.getStatus());
      }
      throw new Error();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 이벤트 매칭시 신청자 팀 배정
   */
  private assignAttendeesTeam(
    attendees: MeetupAttendeeEntity[],
    teamNum: number,
  ) {
    shuffleArray(attendees);
    attendees.forEach((attendee, index) => {
      attendee.teamId = (index % teamNum) + 1;
    });
  }

  async createMatching(matchMeetupDto: MatchMeetupDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { meetupId, userId, teamNum } = matchMeetupDto;
      const meetup = await queryRunner.manager.findOne(MeetupEntity, {
        where: { id: meetupId, matchedAt: IsNull() },
        relations: ['attendees'],
      });

      if (!meetup) {
        throw new NotFoundException(ErrorMessage.MEETUP_NOT_FOUND_OR_CLOSED);
      }
      if (
        userId &&
        !(
          this.isMeetupOwner(meetup, userId) ||
          this.isAdminUser(userId) ||
          this.isMeetupAttendee(meetup.attendees, userId)
        )
      ) {
        throw new ForbiddenException(ErrorMessage.NO_PERMISSION);
      }
      if (meetup.attendees.length > 0 && teamNum > meetup.attendees.length) {
        throw new BadRequestException(ErrorMessage.TOO_MANY_MEETUP_TEAM_NUMBER);
      }

      // 참석자 배열 랜덤으로 섞고, 팀 배정
      this.assignAttendeesTeam(meetup.attendees, teamNum);
      await queryRunner.manager.save(MeetupEntity, {
        id: meetupId,
        matchedAt: new Date(),
        matchUserId: userId,
      });
      await queryRunner.manager.save(MeetupAttendeeEntity, meetup.attendees);
      if (meetup.attendees.length === 0) {
        await queryRunner.manager.softDelete(MeetupEntity, meetup.id);
      }

      // 이벤트 생성시 슬랙봇으로 이벤트 정보 전송
      const message = matchMeetupMessage({
        channel: process.env.SLACK_CHANNEL_JIPHYEONJEON!,
        meetupDetail: MeetupDetailDto.from(meetup),
      });
      await this.slackService.postMessage(message);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (isHttpException(e)) {
        throw new HttpException(e.getResponse(), e.getStatus());
      }
      throw new Error();
    } finally {
      await queryRunner.release();
    }
  }
}
