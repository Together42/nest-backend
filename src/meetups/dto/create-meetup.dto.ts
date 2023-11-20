import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MeetupCategory } from '../enum/meetup-category.enum';

export class CreateMeetupBody {
  @ApiProperty({
    description: '이벤트 제목 (최대 50자)',
    minLength: 1,
    maxLength: 50,
  })
  @Transform((params) =>
    typeof params.value === 'string' ? params.value.trim() : params.value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @ApiProperty({
    description: '이벤트 설명 (최대 255자)',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @Transform((params) => params.value.trim())
  @IsNotEmpty()
  @MaxLength(255)
  description: string;
}

export class CreateMeetupDto extends CreateMeetupBody {
  createUserId?: number;
  categoryId?: MeetupCategory;
}
