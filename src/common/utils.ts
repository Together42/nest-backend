import { HttpException } from '@nestjs/common';
import { Message, Blocks, bold, Attachment } from 'slack-block-builder';
import { MeetupDetailDto } from '../meetups/dto/meetup-detail.dto';
import { MeetupDto } from 'src/meetups/dto/meetup.dto';

/**
 * Fisher-Yates shuffle 방식으로 배열의 요소들을 랜덤으로 섞어줍니다.
 * @param array 모든 타입의 배열을 받습니다.
 */
export const shuffleArray = (array: any[]) => {
  for (let idx = 0; idx < array.length; idx++) {
    const randomIdx = Math.floor(Math.random() * (idx + 1));
    [array[idx], array[randomIdx]] = [array[randomIdx], array[idx]];
  }
};

export const isHttpException = (error: any): error is HttpException => {
  if ('response' in error && 'status' in error) {
    return true;
  }
  return false;
};

/**
 * 이벤트 생성시 보내지는 슬랙봇 메시지
 */
export const meetupCreatedMessage = ({
  channel,
  meetup,
}: {
  channel: string;
  meetup: Pick<MeetupDto, 'title' | 'description'>;
}) => {
  const { title, description } = meetup;
  return Message({ text: `[친해지길 바라] ${title}`, channel })
    .blocks(
      Blocks.Header({
        text: ':fire: 친해지길 바라 :fire:',
      }),
      Blocks.Divider(),
      Blocks.Section({
        text: `${bold(
          title,
        )}\n${description}\n이벤트가 생성되었습니다. 서둘러 참석해주세요!`,
      }),
      Blocks.Section({
        text: process.env.FRONT_URL,
      }),
    )
    .buildToObject();
};

/**
 * 이벤트 매칭시 보내지는 슬랙봇 메시지
 */
export const meetupMatchedMessage = ({
  channel,
  meetupDetail,
}: {
  channel: string;
  meetupDetail: MeetupDetailDto;
}) => {
  const { event, teamList } = meetupDetail;
  const teams = Object.entries(teamList).map(([teamNum, teamMembers]) => {
    const teamMembersNickname = teamMembers.map((member) => member.intraId);
    return `${teamNum}팀 : ${teamMembersNickname.join(', ')}`;
  });
  return Message({ text: `[친해지길 바라] ${event.title}`, channel })
    .blocks(
      Blocks.Header({
        text: ':fire: 친해지길 바라 :fire:',
      }),
      Blocks.Divider(),
      Blocks.Section({
        text: `${bold(event.title)}`,
      }),
      Blocks.Section({
        text: `${teams.join('\n')}`,
      }),
      Blocks.Section({
        text: `팀 매칭이 완료되었습니다. 자신의 팀원들과 연락해보세요! :raised_hands:`,
      }),
    )
    .buildToObject();
};

/**
 * 이벤트 신청시 보내지는 슬랙봇 메시지
 */
export const meetupRegisteredMessage = ({
  channel,
  meetup,
}: {
  channel: string;
  meetup: Pick<MeetupDto, 'title' | 'description'>;
}) => {
  const { title } = meetup;
  return Message({ channel, text: '[친해지길 바라] 이벤트 신청 완료' })
    .blocks(Blocks.Header({ text: '친해지길 바라' }))
    .attachments(
      Attachment()
        .color('#36a64f')
        .blocks(
          Blocks.Section({
            text: `${bold(title)}`,
          }),
          Blocks.Section({
            text: `이벤트 신청이 완료 되었습니다.\n참여 감사합니다 :laughing:`,
          }),
        ),
    )
    .buildToObject();
};

/**
 * 이벤트 신청 취소시 보내지는 슬랙봇 메시지
 */
export const meetupUnregisteredMessage = ({
  channel,
  meetup,
}: {
  channel: string;
  meetup: Pick<MeetupDto, 'title' | 'description'>;
}) => {
  const { title } = meetup;
  return Message({ channel, text: '[친해지길 바라] 이벤트 신청 취소' })
    .blocks(Blocks.Header({ text: '친해지길 바라' }))
    .attachments(
      Attachment()
        .color('#f2c744')
        .blocks(
          Blocks.Section({
            text: `${bold(title)}`,
          }),
          Blocks.Section({
            text: `이벤트 신청이 취소 되었습니다.\n아쉽네요.. 다음에 다시 만나요! :face_holding_back_tears:`,
          }),
        ),
    )
    .buildToObject();
};
