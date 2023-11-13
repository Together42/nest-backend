import {
  HttpExceptionBody,
  HttpExceptionBodyMessage,
  HttpStatus,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { STATUS_CODES } from 'http';

/**
 * 5XX번대 서버 에러
 */
export class ServerExceptionBody implements Omit<HttpExceptionBody, 'error'> {
  @ApiProperty({
    oneOf: [
      { type: 'string', example: '에러 내용' },
      { type: 'string[]', example: ['에러내용1', '에러내용2'] },
    ],
  })
  message: HttpExceptionBodyMessage;

  @ApiProperty()
  statusCode: number;
}

/**
 * 4XX번대 클라이언트 에러
 */
export class ClientExceptionBody implements HttpExceptionBody {
  @ApiProperty({
    oneOf: [
      { type: 'string', example: '에러 내용' },
      { type: 'string[]', example: ['에러내용1', '에러내용2'] },
    ],
  })
  message: HttpExceptionBodyMessage;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;
}

export class InternalServerExceptionBody extends ServerExceptionBody {
  @ApiProperty({
    type: 'string',
    example: STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR],
  })
  message = STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR]!;

  @ApiProperty({ type: 'number', example: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
}

export class NotFoundExceptionBody extends ClientExceptionBody {
  @ApiProperty({
    type: 'string',
    example: STATUS_CODES[HttpStatus.NOT_FOUND],
  })
  error = STATUS_CODES[HttpStatus.FORBIDDEN]!;

  @ApiProperty({ type: Number, example: HttpStatus.NOT_FOUND })
  statusCode = HttpStatus.NOT_FOUND;
}

export class ForbiddenExceptionBody extends ClientExceptionBody {
  @ApiProperty({
    type: 'string',
    example: STATUS_CODES[HttpStatus.FORBIDDEN],
  })
  error = STATUS_CODES[HttpStatus.FORBIDDEN]!;

  @ApiProperty({ type: Number, example: HttpStatus.FORBIDDEN })
  statusCode = HttpStatus.FORBIDDEN;
}

export class BadRequestExceptionBody extends ClientExceptionBody {
  @ApiProperty({
    type: 'string',
    example: STATUS_CODES[HttpStatus.BAD_REQUEST],
  })
  error = STATUS_CODES[HttpStatus.BAD_REQUEST]!;

  @ApiProperty({ type: 'number', example: HttpStatus.BAD_REQUEST })
  statusCode = HttpStatus.BAD_REQUEST;
}
