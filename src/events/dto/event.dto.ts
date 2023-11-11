import { ApiProperty } from '@nestjs/swagger';
import { EventEntity } from '../entities/event.entity';

export class EventDto {
  @ApiProperty({ description: '이벤트 고유 id' })
  id: number;

  @ApiProperty({ description: '이벤트 제목' })
  title: string;

  @ApiProperty({ description: '이벤트 상세' })
  description: string;

  @ApiProperty({ description: '이벤트를 생성한 유저의 id' })
  createdId: number;

  @ApiProperty({ description: '이벤트를 생성한 유저의 닉네임' })
  intraId: string;

  @ApiProperty({ description: '이벤트가 매칭 되었는지 여부' })
  isMatching: 0 | 1;

  @ApiProperty({ description: '이벤트의 카테고리 id' })
  categoryId: number;

  static from(eventEntity: EventEntity) {
    const eventDto = new EventDto();
    eventDto.id = eventEntity.id;
    eventDto.title = eventEntity.title;
    eventDto.description = eventEntity.description;
    eventDto.createdId = eventEntity.createUserId;
    eventDto.intraId = 'any';
    eventDto.categoryId = 0;
    return eventDto;
  }
}
