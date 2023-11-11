import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { IsNull, Repository } from 'typeorm';
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

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    @InjectRepository(EventAttendeeEntity)
    private eventAttendeeRepository: Repository<EventAttendeeEntity>,
  ) {}

  /**
   * [이벤트 생성]
   * 자동 생성 이벤트의 경우, createUserId는 null 입니다.
   * 그 외에는 이벤트를 생성한 유저가 자동으로 해당 이벤트의 첫번째 신청자가 됩니다.
   */
  async create(createEventDto: CreateEventDto) {
    // TODO: 트랜잭션 처리
    const event = this.eventRepository.create(createEventDto);
    const { id, createUserId } = await this.eventRepository.save(event);
    if (createUserId) {
      const firstAttendee = this.eventAttendeeRepository.create({
        eventId: id,
        userId: createUserId,
      });
      await this.eventAttendeeRepository.save(firstAttendee);
    }
  }

  async findAll() {
    const events = await this.eventRepository.find();
    const eventDtos = events.map((event) => EventDto.from(event));
    return eventDtos;
  }

  async findRanking() {
    // TODO: 쿼리빌더가 타입 반환을 any로 반환하는 것을 해결하기
    const eventPoints: EventRankingDto[] = await this.eventAttendeeRepository
      .createQueryBuilder()
      .select('user_id')
      .addSelect('COUNT(event_id)', 'event_points')
      .groupBy('user_id')
      .getRawMany();
    return eventPoints;
  }

  async findOne(findEventDto: FindEventDto) {
    const { id } = findEventDto;
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['eventAttendees'],
    });
    if (!event) {
      throw new BadRequestException();
    }
    const eventDetailDto = EventDetailDto.from(event);
    return eventDetailDto;
  }

  /**
   * 유저가 서비스의 관리자인지 판별
   */
  private isAdminUser(userId: number) {
    // TODO: 유저 엔티티를 조회하여 유저가 관리자인지 확인해야함, 공통 함수로 빼기
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

  /**
   * Fisher-Yates shuffle
   * 배열의 요소들을 랜덤으로 섞어줍니다.
   * @param array 모든 타입의 배열을 받습니다.
   */
  // TODO: 공통 함수로 빼기
  private shuffleArray(array: any[]) {
    for (let idx = 0; idx < array.length; idx++) {
      const randomIdx = Math.floor(Math.random() * (idx + 1));
      [array[idx], array[randomIdx]] = [array[randomIdx], array[idx]];
    }
  }

  /**
   * [이벤트 삭제]
   * 이벤트를 생성한 유저와 관리자만 이벤트 삭제가 가능힙니다.
   */
  async remove(removeEventDto: RemoveEventDto) {
    const { userId, eventId } = removeEventDto;
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) return; // TODO: 예외 던지기
    if (!(this.isEventOwner(event, userId) || this.isAdminUser(userId))) return; // TODO: 예외 던지기
    await this.eventRepository.softDelete(event.id);
  }

  /**
   * [이벤트 참가 신청]
   * 매칭이 안된 이벤트만 참가 가능하며, 중복 참가를 방지합니다.
   */
  async registerEvent(registerEventDto: RegisterEventDto) {
    const { eventId, userId } = registerEventDto;
    const event = await this.eventRepository.findOne({
      where: { id: eventId, matchedAt: IsNull() },
      relations: ['eventAttendees'],
    });
    if (!event) return; // TODO: 예외 던지기
    if (this.isEventAttendee(event.eventAttendees, userId)) return; // TODO: 예외 던지기
    const attendance = this.eventAttendeeRepository.create(registerEventDto);
    await this.eventAttendeeRepository.save(attendance);
  }

  /**
   * [이벤트 참가 취소]
   * 신청 내역이 있어야 취소 가능합니다.
   */
  async unregisterEvent(unregisterEventDto: UnregisterEventDto) {
    const eventAttendee =
      await this.eventAttendeeRepository.findOneBy(unregisterEventDto);
    if (!eventAttendee) return; // TODO: 예외 던지기
    await this.eventAttendeeRepository.softDelete(eventAttendee.id);
  }

  /**
   * [이벤트 매칭하기]
   * 이벤트를 생성한 유저와 관리자, 그리고 이벤트 신청자만 이벤트 매칭이 가능힙니다.
   * 이미 매칭한 이벤트를 또 매칭할 수는 없습니다.
   */
  async createMatching(matchEventDto: MatchEventDto) {
    // TODO: 트랜잭션 처리
    const { eventId, userId, teamNum = 1 } = matchEventDto;
    const event = await this.eventRepository.findOne({
      where: { id: eventId, matchedAt: IsNull() },
      relations: ['eventAttendees'],
    });
    if (!event) return; // TODO: 예외 던지기
    if (
      !(
        this.isEventOwner(event, userId) ||
        this.isAdminUser(userId) ||
        this.isEventAttendee(event.eventAttendees, userId)
      )
    ) {
      return; // TODO: 예외 던지기
    }
    const { eventAttendees } = event;
    // 참석자 배열 랜덤으로 섞고, 팀 배정
    this.shuffleArray(eventAttendees);
    eventAttendees.forEach((attendee, index) => {
      attendee.teamId = (index % teamNum) + 1;
    });
    await this.eventRepository.update(eventId, {
      matchedAt: new Date(),
      matchUserId: userId,
    });
    await this.eventAttendeeRepository.save(eventAttendees);
  }
}
