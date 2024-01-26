export enum ErrorMessage {
  NO_PERMISSION = '권한이 없습니다.',
  MEETUP_NOT_FOUND = '존재하지 않는 이벤트입니다.',
  MEETUP_NOT_FOUND_OR_CLOSED = '존재하지 않거나 마감된 이벤트입니다.',
  MEETUP_REGISTRATION_NOT_FOUND = '해당 이벤트에 신청한 내역이 없습니다.',
  MEETUP_REGISTRATION_ALREADY_EXIST = '이미 신청한 이벤트 입니다.',
  TOO_MANY_MEETUP_TEAM_NUMBER = '신청 인원보다 팀 개수가 많습니다.',

  USER_NOT_FOUND = '존재하지 않는 유저입니다.',

  HASH_TOKEN_ERROR = 'HASH_TOKEN_ERROR'
}

export type KeyOfErrorMessage = keyof typeof ErrorMessage;