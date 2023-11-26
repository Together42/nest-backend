import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { RotationAttendeeEntity } from './entity/rotation-attendee.entity';
import { GetUser } from 'src/decorator/user.decorator';
import { FindRotationQueryDto } from './dto/find-rotation-query.dto';
import { getNextYearAndMonth } from './utils/date';
import { RemoveRotationQueryDto } from './dto/remove-rotation.dto';

@Controller('rotations')
export class RotationsController {
  constructor(private readonly rotationsService: RotationsService) {}

  /*
   * 본인 로테이션 생성 (달력)
   * Auth : own
   */
  @Post('/')
  @UsePipes(ValidationPipe)
  createOwnRotation(
    @GetUser() user: any,
    @Body() createRotationDto: CreateRotationDto,
  ) {
    return this.rotationsService.createOrUpdateRotation(
      createRotationDto,
      user.uid,
    );
  }

  /*
   * 사서 로테이션 조회 (달력)
   * Query: year=?&month=?
   *  - year&month : 해당 year와 month에 해당하는 쿼리 반환
   *  - year : 해당 year에 해당하는 모든 month의 쿼리 반환
   *  - month : 해당 month에 해당하는 이번 연도 쿼리 반환
   *  - none : DB에 있는 모든 쿼리 반환
   * Auth : None
   */
  @Get('/')
  findAllRotation(
    @Query(new ValidationPipe({ transform: true }))
    findRotationQueryDto: FindRotationQueryDto,
  ) {
    const {
      month = getNextYearAndMonth().month,
      year = getNextYearAndMonth().year,
    } = findRotationQueryDto;

    return this.rotationsService.findAllRotation(year, month);
  }

  /*
   * 당일 사서 조회 (달력)
   * 구글 시트를 위한 API
   * Auth : None
   */
  @Get('/today/')
  findTodayRotation() {
    return this.rotationsService.findTodayRotation();
  }

  /*
   * 사서 로테이션 수정 (달력)
   * Auth : user
   */
  @Patch('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateUserRotation(
    @GetUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRotationDto: UpdateRotationDto,
  ) {
    return this.rotationsService.updateRotation(
      updateRotationDto,
      id,
      user.uid,
    );
  }

  /*
   * 사서 로테이션 삭제 (달력)
   * Param: id
   *  - id: 삭제하고자 하는 유저의 id. 즉, API를 호출하는 유저 본인의 id
   * Query: day=?&year=?&month=?
   *  - day: 필수적으로 입력해야 하는 쿼리
   *  - year & month: year, month 스코프에 해당하는 user 정보를 삭제
   *    - 만약 없다면, 다음 달 year, month에 해당하는 user 정보를 삭제
   * Auth : own
   */
  @Delete('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  removeOwnRotation(
    @GetUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Query(new ValidationPipe({ transform: true }))
    removeRotationQueryDto: RemoveRotationQueryDto,
  ) {
    if (id != user.uid) {
      throw new UnauthorizedException(
        `User don't have permission to remove ${id}'s information`,
      );
    }

    const { day, month = undefined, year = undefined } = removeRotationQueryDto;

    return this.rotationsService.removeRotation(id, day, month, year);
  }

  /*
   * 본인 로테이션 신청 (다음 달)
   * Auth : own
   * annotation getuser 찾아보기
   * Auth 스코프는 어떻게 정해야 할까?
   * - useGuard : JWT guard : seowokim님 머지 후 다시 보기
   */
  @Post('/attendee')
  @UsePipes(ValidationPipe)
  async createOwnRegistration(
    @GetUser() user: any,
    @Body() createRegistrationDto: CreateRegistrationDto,
  ): Promise<RotationAttendeeEntity> {
    return await this.rotationsService.createRegistration(
      createRegistrationDto,
      user.uid,
    );
  }

  /*
   * 본인 로테이션 신청 조회 (다음 달)
   * Auth : own
   */
  @Get('/attendee')
  async findOwnRegistration(
    @GetUser() user: any,
  ): Promise<Partial<RotationAttendeeEntity>> {
    return await this.rotationsService.findRegistration(user.uid);
  }

  /*
   * 본인 로테이션 신청 취소 (다음 달)
   * Auth : own
   */
  @Delete('/attendee')
  async removeOwnRegistration(@GetUser() user: any): Promise<void> {
    return await this.rotationsService.removeRegistration(user.uid);
  }
}
