import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { RotationAttendeeEntity } from './entity/rotation-attendee.entity';
import { GetUser } from 'src/decorator/user.decorator';
import { RemoveRotationQueryDto } from './dto/remove-rotation.dto';
import { RotationEntity } from './entity/rotation.entity';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserEntity } from 'src/user/entity/user.entity';
import { RoleGuard } from 'src/auth/guard/role.guard';
import UserRole from 'src/user/enum/user.enum';
import { Role } from 'src/decorator/role.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BadRequestExceptionBody,
  InternalServerExceptionBody,
  NotFoundExceptionBody,
} from 'src/common/dto/error-response.dto';
import { FindTodayRotationDto } from './dto/find-today-rotation.dto';
import { FindRegistrationDto } from './dto/find-registration.dto';
import { FindAllRotationDto } from './dto/find-all-rotation.dto';
import { FindRotationQueryDto } from './dto/find-rotation-query.dto';

@Controller('rotations')
@ApiTags('rotations')
export class RotationsController {
  constructor(private readonly rotationsService: RotationsService) {}

  /*
   * 당일 사서 조회 (달력)
   * 구글 시트를 위한 API
   * Auth : None
   * 먼가 잘 안되는 것 같기도...
   */
  @Get('/today')
  @ApiOperation({
    summary: '당일 사서 조회',
    description: '당일 사서 조회를 위한 API. 구글 시트에서 사용 예정. 누구나 사용할 수 있습니다.',
  })
  @ApiOkResponse({
    type: [FindTodayRotationDto],
  })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  findTodayRotation(): Promise<FindTodayRotationDto[]> {
    return this.rotationsService.findTodayRotation();
  }

  /*
   * 본인 로테이션 신청 조회 (다음 달)
   * Auth : own, admin
   */
  @Get('/attendance')
  @UseGuards(JwtGuard, RoleGuard)
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @ApiOperation({
    summary: '본인 로테이션 신청 조회',
    description:
      '다음 달 본인 로테이션 신청 조회를 위한 API. 유저 본인의 로테이션 신청 여부를 확인할 수 있습니다. 사서 등급인 유저 본인과 관리자만 사용 가능합니다.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: RotationAttendeeEntity,
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async findOwnRegistration(@GetUser() user: UserEntity): Promise<FindRegistrationDto> {
    return await this.rotationsService.findRegistration(user.id);
  }

  /*
   * 본인 로테이션 신청 (다음 달)
   * Auth : own, admin
   */
  @Post('/attendance')
  @UseGuards(JwtGuard, RoleGuard)
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @ApiOperation({
    summary: '본인 로테이션 신청',
    description:
      '다음 달 유저 본인의 로테이션 신청을 위한 API. 사서 등급인 유저 본인과 관리자만 사용 가능합니다. 유저가 참여하지 못한다고 선택한 다음 달 사서 업무 일정이 담긴 배열이 body에 들어와야 합니다. 일정은 1일부터 31일까지의 숫자로 이루어진 배열이어야 합니다. 예를 들어 1일, 2일, 3일에 참여하지 못한다고 선택했다면 [1, 2, 3]이 body에 들어와야 합니다. 일정이 없다면 빈 배열을 body에 담아야 합니다.',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '본인 로테이션 신청 성공',
    type: RotationAttendeeEntity,
  })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiNotFoundResponse({ type: NotFoundExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async createOwnRegistration(
    @GetUser() user: UserEntity,
    @Body() createRegistrationDto: CreateRegistrationDto,
  ): Promise<RotationAttendeeEntity> {
    return await this.rotationsService.createRegistration(createRegistrationDto, user.id);
  }

  /*
   * 본인 로테이션 신청 취소 (다음 달)
   * Auth : own, admin
   */
  @Delete('/attendance')
  @UseGuards(JwtGuard, RoleGuard)
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @ApiOperation({
    summary: '본인 로테이션 신청 취소',
    description:
      '다음 달 유저 본인의 로테이션 신청 취소를 위한 API. 사서 등급인 유저 본인과 관리자만 사용 가능합니다.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '본인 로테이션 신청 취소 성공',
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async removeOwnRegistration(@GetUser() user: UserEntity): Promise<void> {
    return await this.rotationsService.removeRegistration(user.id);
  }

  /*
   * 사서 로테이션 조회 (달력)
   * Auth : None
   */
  @Get('/')
  @ApiOperation({
    summary: '사서 로테이션 조회',
    description:
      '사서 로테이션 조회를 위한 API. 누구나 사용할 수 있습니다. 기본적으로는 DB 내 모든 로테이션 정보를 반환하지만, url parameter에 year와 month를 제공하면(/rotations?year=2024&month=1) 해당 연도와 월의 로테이션 정보만 반환합니다. 연도와 월은 body에 함께 제공되어야 합니다.',
  })
  @ApiOkResponse({
    type: [RotationEntity],
  })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  findAllRotation(
    @Query() findRotationQueryDto: FindRotationQueryDto,
  ): Promise<FindAllRotationDto[]> {
    const { year, month } = findRotationQueryDto;
    return this.rotationsService.findAllRotation(year, month);
  }

  /*
   * 본인 로테이션 생성 (달력)
   * Auth : own, admin
   */
  @Post('/')
  @UseGuards(JwtGuard, RoleGuard)
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @ApiOperation({
    summary: '본인 로테이션 생성',
    description:
      '본인 로테이션 생성을 위한 API. 사서 등급인 유저 본인과 관리자만 사용 가능합니다. 기존에 생성된 로테이션이 있으면 수정됩니다. 사서 달력에서 일정을 유저 본인의 일정을 원하는 날짜에 추가할 수 있습니다. body에는 유저가 신청한 연도, 월, 그리고 달력에 추가하고자 하는 일정을 담아야 합니다. 일정은 개수에 상관 없이 JSON 배열 형태가 되어야 합니다.',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '본인 로테이션 생성 성공',
    type: String,
  })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  createOwnRotation(
    @GetUser() user: UserEntity,
    @Body() createRotationDto: CreateRotationDto,
  ): Promise<string> {
    return this.rotationsService.createOrUpdateRotation(createRotationDto, user.id);
  }

  /*
   * 사서 로테이션 삭제 (달력)
   * Auth : own, admin
   */
  @Delete('/')
  @UseGuards(JwtGuard, RoleGuard)
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @ApiOperation({
    summary: '사서 로테이션 삭제',
    description:
      '사서 로테이션 삭제를 위한 API. 사서 등급인 유저 본인과 관리자만 사용 가능합니다. 사서 달력에 등록된 유저 본인의 일정을 삭제할 수 있습니다. body에는 삭제할 일정의 연도, 월, 일을 함께 제공해야 합니다. body에 연도와 달을 제공하지 않으면 다음 달을 기준으로 일정을 찾아 삭제합니다. 따라서 일은 반드시 제공되어야 합니다.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '사서 로테이션 삭제 성공',
    type: String,
  })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiNotFoundResponse({ type: NotFoundExceptionBody })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  removeOwnRotation(
    @GetUser() user: UserEntity,
    @Body()
    removeRotationQueryDto: RemoveRotationQueryDto,
  ): Promise<string> {
    const { day, month, year } = removeRotationQueryDto;
    return this.rotationsService.removeRotation(user.id, day, month, year);
  }

  /*
   * 사서 로테이션 수정 (달력)
   * Auth : all user, admin
   */
  @Patch('/:id')
  @UseGuards(JwtGuard, RoleGuard)
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @ApiOperation({
    summary: '사서 로테이션 수정',
    description:
      '사서 로테이션 수정을 위한 API. 사서 등급인 유저 본인과 관리자만 사용 가능합니다. 달력에 등록된 사서의 일정을 수정할 수 있습니다. 변경하고자 하는 유저의 intraId를 parameter로 제공해야 합니다. 또한 변경하고자 하는 유저의 기존 일정과, 변경된 유저의 일정이 body에 제공되어야 합니다.',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '사서 로테이션 수정 성공',
    type: String,
  })
  @ApiBadRequestResponse({ type: BadRequestExceptionBody })
  @ApiNotFoundResponse({ type: NotFoundExceptionBody })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  updateUserRotation(
    @GetUser() user: UserEntity,
    @Param('id') intraId: string,
    @Body() updateRotationDto: UpdateRotationDto,
  ): Promise<string> {
    return this.rotationsService.updateRotation(updateRotationDto, intraId, user.id);
  }
}
