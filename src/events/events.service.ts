import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { EventAttendeeEntity } from './entities/event-attendee.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { MatchEventDto } from './dto/match-event.dto';
import { EventRankingDto } from './dto/event-ranking.dto';
import { FindEventDto } from './dto/find-event.dto';
import { RemoveEventDto } from './dto/remove-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { UnregisterEventDto } from './dto/unregister-event.dto';
import { EventDetailDto } from './dto/event-detail.dto';
import { EventDto } from './dto/event.dto';
import { ErrorMessage } from 'src/common/error-message';
import { exceptionHandling, shuffleArray } from 'src/common/utils';

@Injectable()
export class EventsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(EventAttendeeEntity)
    private eventAttendeeRepository: Repository<EventAttendeeEntity>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let error: any;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const event = this.eventRepository.create(createEventDto);
      const { id, createUserId } = await queryRunner.manager.save(event);
      if (createUserId) {
        const firstAttendee = this.eventAttendeeRepository.create({
          eventId: id,
          userId: createUserId,
        });
        await queryRunner.manager.save(firstAttendee);
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      error = e;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      if (error) exceptionHandling(error);
    }
  }

  async findAll() {
    const events = await this.eventRepository.find();
    const eventDtos = events.map((event) => EventDto.from(event));
    return eventDtos;
  }

  async findRanking() {
    // TODO: 쿼리빌더가 타입 반환을 any로 반환하는 것을 해결하기
    const eventRanking: EventRankingDto[] = await this.eventAttendeeRepository
      .createQueryBuilder()
      .select('user_id')
      .addSelect('COUNT(event_id)', 'event_points')
      .groupBy('user_id')
      .getRawMany();
    return eventRanking;
  }

  async findOne(findEventDto: FindEventDto) {
    const { id } = findEventDto;
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['attendees'],
    });
    if (!event) {
      throw new NotFoundException(ErrorMessage.EVENT_NOT_FOUND);
    }
    const eventDetailDto = EventDetailDto.from(event);
    return eventDetailDto;
  }

  /**
   * 유저가 서비스의 관리자인지 판별
   */
  private isAdminUser(userId: number) {
    // TODO: 유저 엔티티를 조회하여 유저가 관리자인지 확인해야함, 유저 모듈로 빼기
    userId;
    return true;
  }

  /**
   * 유저가 해당 이벤트를 생성한 유저인지 판별
   */
  private isEventOwner(event: EventEntity, targetUserId: number) {
    return event.createUserId === targetUserId;
  }

  /**
   * 유저가 이벤트 참여자 중 하나인지 판별
   */
  private isEventAttendee(
    eventAttendees: EventAttendeeEntity[],
    targetUserId: number,
  ) {
    return eventAttendees.some((attendee) => attendee.userId === targetUserId);
  }

  async remove(removeEventDto: RemoveEventDto) {
    const { userId, eventId } = removeEventDto;
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException(ErrorMessage.EVENT_NOT_FOUND);
    }
    if (!(this.isEventOwner(event, userId) || this.isAdminUser(userId))) {
      throw new ForbiddenException(ErrorMessage.NO_PERMISSION);
    }
    await this.eventRepository.update(event.id, {
      deletedAt: new Date(),
      deleteUserId: userId,
    });
  }

  async registerEvent(registerEventDto: RegisterEventDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let error: any;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { eventId, userId } = registerEventDto;
      const event = await queryRunner.manager.findOne(EventEntity, {
        where: { id: eventId, matchedAt: IsNull() },
        relations: ['attendees'],
      });
      if (!event) {
        throw new NotFoundException(ErrorMessage.EVENT_NOT_FOUND_OR_CLOSED);
      }
      if (this.isEventAttendee(event.attendees, userId)) {
        throw new BadRequestException(
          ErrorMessage.EVENT_REGISTRATION_ALREADY_EXIST,
        );
      }
      const attendance = this.eventAttendeeRepository.create(registerEventDto);
      await queryRunner.manager.save(attendance);
      await queryRunner.commitTransaction();
    } catch (e) {
      error = e;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      if (error) exceptionHandling(error);
    }
  }

  async unregisterEvent(unregisterEventDto: UnregisterEventDto) {
    const { eventId, userId } = unregisterEventDto;
    const eventAttendee = await this.eventAttendeeRepository.findOne({
      where: { eventId, userId, teamId: IsNull() },
    });
    if (!eventAttendee) {
      throw new NotFoundException(ErrorMessage.EVENT_REGISTRATION_NOT_FOUND);
    }
    await this.eventAttendeeRepository.softDelete(eventAttendee.id);
  }

  async createMatching(matchEventDto: MatchEventDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let error: any;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { eventId, userId, teamNum = 1 } = matchEventDto;
      const event = await queryRunner.manager.findOne(EventEntity, {
        where: { id: eventId, matchedAt: IsNull() },
        relations: ['attendees'],
      });

      if (!event) {
        throw new NotFoundException(ErrorMessage.EVENT_NOT_FOUND_OR_CLOSED);
      }
      if (
        !(
          this.isEventOwner(event, userId) ||
          this.isAdminUser(userId) ||
          this.isEventAttendee(event.attendees, userId)
        )
      ) {
        throw new ForbiddenException(ErrorMessage.NO_PERMISSION);
      }
      if (teamNum > event.attendees.length) {
        throw new BadRequestException(ErrorMessage.TOO_MANY_EVENT_TEAM_NUMBER);
      }

      // 참석자 배열 랜덤으로 섞고, 팀 배정
      const { attendees } = event;
      shuffleArray(attendees);
      attendees.forEach((attendee, index) => {
        attendee.teamId = (index % teamNum) + 1;
      });

      await queryRunner.manager.save(EventEntity, {
        id: eventId,
        matchedAt: new Date(),
        matchUserId: userId,
      });
      await queryRunner.manager.save(EventAttendeeEntity, attendees);
      await queryRunner.commitTransaction();
    } catch (e) {
      error = e;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      if (error) exceptionHandling(error);
    }
  }
}
