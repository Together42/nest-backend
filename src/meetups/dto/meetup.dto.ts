import { ApiProperty } from '@nestjs/swagger';
import { MeetupEntity } from '../entity/meetup.entity';
import { MeetupCategory } from '../enum/meetup-category.enum';
import { MeetupStatus } from '../enum/meetup-status.enum';

export class MeetupDto {
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

  @ApiProperty({
    enum: MeetupStatus,
    description: '이벤트가 매칭 되었는지 여부',
  })
  isMatching: MeetupStatus;

  @ApiProperty({ enum: MeetupCategory, description: '이벤트의 카테고리 id' })
  categoryId: MeetupCategory;

  static from(meetupEntity: MeetupEntity) {
    const meetupDto = new MeetupDto();
    meetupDto.id = meetupEntity.id;
    meetupDto.title = meetupEntity.title;
    meetupDto.description = meetupEntity.description;
    meetupDto.createdId = meetupEntity.createUserId;
    meetupDto.isMatching = meetupEntity.matchedAt
      ? MeetupStatus.MATCH
      : MeetupStatus.UNMATCH;
    meetupDto.categoryId = meetupEntity.categoryId;
    if (meetupEntity.createUser) {
      meetupDto.intraId = meetupEntity.createUser.nickname;
    }
    return meetupDto;
  }
}
